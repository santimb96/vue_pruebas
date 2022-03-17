import fetch from "cross-fetch";
import fs from "fs";


const APP = {
    url: [],
    pokeList: [],

    getData: async function () {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        await this.pushingUrl(data);
    },
    pushingUrl: function (data) {
        data.results.forEach(pokemon => {
            this.url.push(pokemon.url);
            console.log(pokemon.url);
        });
        this.fetchingUrl(this.url).then(() => this.writeData());
    },
    fetchingUrl: async function (url) {
         for (const data of url) {
             const async = await this.getPokemon(data);
             this.pokeList.push(async);
        }

        return this.writeData();

    },

    getPokemon: async function (url) {
        const response = await fetch(url);
        const data = await response.json();
        console.log({
            id: data.id,
            name: data.name,
            level: 1,
            type: data.types[0].type.name,
            speed: data.stats[5].base_stat,
            img: `https://images.gameinfo.io/pokemon-trimmed/60/p${data.id}.webp`
        })
        return {
            _id: data.id,
            name: data.name,
            level: 1,
            type: data.types[0].type.name,
            speed: data.stats[5].base_stat,
            img: `https://images.gameinfo.io/pokemon-trimmed/60/p${data.id}.webp`
        };

    },
    writeData: function () {
        const filtrados = this.pokeList.filter(pokemon => ['grass', 'fire', 'water'].includes(pokemon.type));
        const sortedObj = filtrados.sort((a, b) => {
            return a._id < b._id ? -1 : a._id > b._id ? 1 : 0;
        });

        fs.writeFile("db.json", JSON.stringify(sortedObj), (err) => {
            if (err) return console.error(err);
            console.info('Saved!');
        });


    }
}
APP.getData();