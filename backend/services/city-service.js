const fs = require('fs');
const csv = require('csv-parser');

const database = require('../db');
const City = require('../models/city');

let CityService = class CityService {

    async fillData() {
        await database.sync();
        let states = {};
        let cities = {};
        await new Promise((resolve, reject) => {
            fs.createReadStream('data/cities.csv')
                .pipe(csv({ skipLines: 2, separator: ';' }))
                .on('data', function (data) {
                    try {
                        let code = data['Cód.'];
                        let name = data['Unidade da Federação e Município'];
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
                })
                .on('end', async function () {
                    for (var cityCode in cities) {
                        let stateCode = cityCode.substring(0, 2);
                        let cityName = cities[cityCode];
                        let stateName = states[stateCode];

                        try {
                            City.create({
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
                    resolve();
                });
        });
    }
};

module.exports = CityService;