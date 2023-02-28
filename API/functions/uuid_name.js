const requete = require("./requete");
const fs = require('fs').promises;
let data = require("./uuid_name_stocké.json");


const Mojang = "https://sessionserver.mojang.com/session/minecraft/profile/";

async function uuid_username(liste_uuid) {
    return new Promise((resolve, rejects) => {
        setTimeout(async () => {
            /*
            fs.readFileSync('./uuid_name_stocké.txt', function(error, data) {
                const fichier = data;
        })
            let data = JSON.parse(fichier)
            */
            let liste_membre = [];
            for (let i = 0;i<liste_uuid.length;i++) {//5 pour test, mettre liste_uuid.length
                let uuid = liste_uuid[i];
                if (data[uuid] == undefined) {
                    let page_web = await requete.get_page(Mojang+uuid);
                    let {id, name, properties} = page_web;
                    let a_ecrire = {uuid: name}
                    /*
                    fs.appendFileSync("./uuid_name_stocké.json", JSON.stringify(a_ecrire), function(erreur) {
                        if (erreur){
                            rejects("erreur lors de l'ouverture de la base de données" + erreur);
                        }
                    });
                    */
                    data[uuid] = name;
                    liste_membre.push(name);
                
                } else {
                    liste_membre.push(data[uuid]);
                }
            }
            /*
            fs.writeFileSync("uuid_name_stocké.json", data, function(erreur) {
                if (erreur){
                    rejects("erreur lors de l'ouverture de la base de données" + erreur);
                }
       });
       await fs.writeFile("./uuid_name_stocké.json", JSON.stringify(data), { flag: 'wq' }, function(err) {
       if (err)
            return console.error(err);
       const data2 = await fs.readFile('./uuid_name_stocké.json', 'utf-8', function (err, data2) {
            if (err)
                return console.error(err);
       })})
       */
       await fs.writeFile("./API/functions/uuid_name_stocké.json", JSON.stringify(data))
       const data2 = await fs.readFile("./API/functions/uuid_name_stocké.json")
       resolve(liste_membre);
       },0)
    })
}

module.exports = { uuid_username };