const { getLatestProfile } = require('../../../API/functions/getLatestProfile');
const { addCommas } = require('../../contracts/helperFunctions');
const messages = require('../../../messages.json');
const { default: axios } = require('axios');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'mining',
    description: 'Obtient des données de minage sur un joueur',
    options: [
        {
            name: 'name',
            description: 'Pseudo Minecraft',
            type: 3,
            required: false
        },


      ],
    execute: async (interaction, client, InteractionCreate) => {
        await interaction.deferReply();
        await wait(1);
        const linked = require('../../../data/discordLinked.json')
        const uuid = linked?.[interaction?.user?.id]?.data[0]
        let name = interaction.options.getString("name") || uuid
        const username = (
            await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
          ).data.data.player.username;
          const uuid2 = (
            await axios.get(`https://playerdb.co/api/player/minecraft/${name}`)
          ).data.data.player.raw_id;
        const profileraw = (await axios.get(`https://sky.shiiyu.moe/api/v2/profile/${uuid2}`)).data.profiles
        let currentProfile;
        for (var key of Object.keys(profileraw)) {
            if (profileraw[key].current) currentProfile = key;}
        const data = await getLatestProfile(name)
        const profilename = (data.profileData.cute_name)
        const player = (profileraw[currentProfile])
        const hotmlvl = (player.data.mining.core.tier.level)
        const xpForNext = (player.data.mining.core.tier.xp) || `0`
        const xp = addCommas(xpForNext)
        const progress = (player.data.mining.core.tier.progress) || `100%`
        const hotmprogress = Math.round((progress) * 100) / 100
        const milestone = (player.data.mining.commissions.milestone)
        const completions = (player.data.mining.commissions.completions)
        const completionscomma = addCommas(completions)
        const pickaxe_ability = (player.data.mining.core.selected_pickaxe_ability)


        const chat = {
            title: `Statistiques de minage de ${username} sur ${profilename}`,
            URL: `https://sky.shiiyu.moe/stats/${name}`,
            description: (``),
            thumbnail: {
                url: `https://api.mineatar.io/body/full/${name}`,
            },
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: "<:HeartOfTheMountain:1061814218598391818> HotM Level",
                    value: `${hotmlvl}`,
                    inline: true
                },
                {
                    name: `<:iron_nugget:1061814731905716254> HotM Exp`,
                    value: `${xp}`,
                    inline: true
                },
                {
                    name: `<:CrystalHollows:1061815055403974657> Progrès du niveau suivant`,
                    value: `${hotmprogress}%`, //Pas fini !! !!
                    inline: true
                },
                {
                    name: "<:Iron_Pickaxe:1061814368196628561> Commission Milestone",
                    value: `${milestone}`,
                    inline: true
                },
                {
                    name: `<:ROYAL_PIGEON:1061815676282617896> Commissions totales`,
                    value: `${completionscomma}`,
                    inline: true
                },
                {
                    name: `<:diamond_pickaxe:1061817609177288824> Capacité de pioche`,
                    value: `**${pickaxe_ability}**`,
                    inline: true
                },
            ],
            footer: {text: `${messages.footerhelp}`, iconURL: `${messages.iconurl}`},
            };


            await interaction.editReply({  embeds: [ chat ] })
    }
}