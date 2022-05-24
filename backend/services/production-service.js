const fs = require('fs');
const csv = require('csv-parser');

const database = require('../db');
const City = require('../models/city');
const Production = require('../models/production');

let ProductionService = class ProductionService {
    async fillData() {
        await database.sync();
        await new Promise((resolve, reject) => {
            for (let i = 1974; i <= 2020; i++) {
                fs.createReadStream('data/' + i + '.csv')
                    .pipe(csv({ skipLines: 2, separator: ';' }))
                    .on('data', async function (data) {
                        if (!data['Município']) {
                            return;
                        }
                        try {
                            let keyValue;
                            for (let prop in data) {
                                if (prop.startsWith('Valor da produção')) {
                                    keyValue = prop;
                                }
                            }
                            let year = data['Ano'];
                            let cityName = data['Município'];
                            let product = data['Produto das lavouras temporárias e permanentes'];
                            let plantedArea = data['Área plantada ou destinada à colheita'];
                            let harvestedArea = data['Área colhida (Hectares)'];
                            let quantity = data['Quantidade produzida (Toneladas)'];
                            let value = data[keyValue];
                            let city = await City.findOne({ where: { cityName: cityName } });
                            try {
                                Production.create({
                                    year: year,
                                    product: product,
                                    plantedArea: plantedArea,
                                    harvestedArea: harvestedArea,
                                    quantity: quantity,
                                    value: value,
                                    cityId: city.id
                                });
                            } catch (error) {
                                console.log(error);
                                reject();
                            }
                        }
                        catch (err) {
                            console.log(err);
                            reject();
                        }
                    })
                    .on('end', async function () {
                        console.log('Finalizado processamento das produções');
                        resolve();
                    });
            }
        });
    }
};

module.exports = ProductionService;