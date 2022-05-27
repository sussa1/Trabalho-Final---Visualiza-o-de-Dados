import { parse } from 'csv-parse/sync';
import fs from 'fs';

import City from '../models/city.js';

export default class CityService {

    static async fillData() {
        let states = {};
        let cities = {};
        await new Promise((resolve, reject) => {
            const records = parse(fs.readFileSync('data/cities.csv', 'utf-8').toString(), { delimiter: ';', columns: true });
            for (let record of records) {
                try {
                    let code = record['Cód.'];
                    let name = record['Unidade da Federação e Município'];
                    if (code.length === 2) { // State
                        states[code] = name;
                    } else { // City
                        cities[code] = name;
                    }
                }
                catch (err) {
                    console.log(err);
                    reject();
                }
            }
            let citiesObjects = []
            for (var cityCode in cities) {
                let stateCode = cityCode.substring(0, 2);
                let cityName = cities[cityCode];
                let stateName = states[stateCode];

                try {
                    citiesObjects.push({
                        cityCode: cityCode,
                        stateCode: stateCode,
                        cityName: cityName,
                        stateName: stateName
                    });
                } catch (error) {
                    console.log(error);
                    reject();
                }
            }
            City.bulkCreate(citiesObjects, { logging: false }).then(r => {
                resolve();
            });
        });
    }
};