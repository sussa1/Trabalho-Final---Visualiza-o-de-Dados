import { parse } from 'csv-parse/sync';
import fs from 'fs';

import City from '../models/city.js';
import Production from '../models/production.js';

export default class ProductionService {
    static async fillData(file) {
        console.log(file);
        await new Promise(async (resolve, reject) => {
            const records = parse(fs.readFileSync('data/' + file + '.csv').toString(), { from_line: 3, delimiter: ';', columns: true });
            let produtos = [];
            for (let record of records) {
                if (!record['Município']) {
                    return;
                }
                try {
                    let keyValue;
                    for (let prop in record) {
                        if (prop.startsWith('Valor da produção')) {
                            keyValue = prop;
                        }
                    }
                    const year = record['Ano'];
                    const cityName = record['Município'];
                    const product = record['Produto das lavouras temporárias e permanentes'];
                    const plantedArea = record['Área plantada ou destinada à colheita'];
                    const harvestedArea = record['Área colhida (Hectares)'];
                    const quantity = record['Quantidade produzida (Toneladas)'];
                    const value = record[keyValue];
                    const city = await City.findOne({ where: { cityName: cityName }, attributes: ['id'], logging: false });

                    produtos.push({
                        year: year,
                        product: product,
                        plantedArea: plantedArea,
                        harvestedArea: harvestedArea,
                        quantity: quantity,
                        value: value,
                        cityId: city.id
                    });

                }
                catch (err) {
                    console.log(err);
                    reject();
                }
            }
            try {
                console.log('Creating...');
                await Production.bulkCreate(produtos, { logging: false });
            } catch (error) {
                console.log(error);
                reject();
            }
            resolve();
        });
    }
};