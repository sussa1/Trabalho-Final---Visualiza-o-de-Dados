import { parse } from 'csv-parse/sync';
import { Sequelize } from "sequelize";
import fs from 'fs';
import csv from 'csvtojson';
import groupBy from 'group-by-with-sum'

import City from '../models/city.js';
import Production from '../models/production.js';

export default class ProductionService {
    static async fillData(file) {
        await new Promise(async (resolve, reject) => {
            let productions = [];
            await csv()
                .fromStream(fs.createReadStream('data/' + file + '.csv'))
                .subscribe(async function (jsonObj) { //single json object will be emitted for each csv line
                    try {
                        const year = parseFloat(jsonObj['ano']);
                        const cityId = parseFloat(jsonObj['id_municipio']);
                        const product = jsonObj['produto'];
                        const plantedArea = parseFloat(jsonObj['area_plantada']);
                        const harvestedArea = parseFloat(jsonObj['area_colhida']);
                        const quantity = parseFloat(jsonObj['quantidade_produzida']);
                        const value = jsonObj['valor_producao'] === '' ? 0 : parseFloat(jsonObj['valor_producao']);
                        if (value != NaN || quantity != NaN || harvestedArea != NaN || plantedArea != NaN) {
                            productions.push({
                                year: year,
                                product: product,
                                plantedArea: plantedArea,
                                harvestedArea: harvestedArea,
                                quantity: quantity,
                                value: value,
                                cityId: cityId
                            });
                            if (productions.length === 500000) {
                                await Production.bulkCreate(productions, { logging: false });
                                console.log('Criados ' + productions.length);
                                productions = [];
                            }
                        }
                    }
                    catch (err) {
                        console.log(err);
                        reject();
                    }
                });
            await Production.bulkCreate(productions, { logging: false });
            console.log('Criados ' + productions.length);
            resolve();
        });
    }

    static async getStateProductionValues(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), value: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'value'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
            res[i].dataValues.value /= ProductionService.getInflationCorrection(res[i].dataValues.year);
        }
        return res.map(r => r.dataValues);
    }

    static getQuantityTreatedFruit(name, year) {
        if (year <= 2000 && name === 'Banana (cacho)') {
            return 10.20;
        }

        if (year <= 2000 && name === 'Abacate') {
            return 0.38;
        }

        if (year <= 2000 && name === 'Caqui') {
            return 0.18;
        }

        if (year <= 2000 && name === 'Figo') {
            return 0.09;
        }

        if (year <= 2000 && name === 'Goiaba') {
            return 0.16;
        }

        if (year <= 2000 && name === 'Laranja') {
            return 0.16;
        }

        if (year <= 2000 && name === 'Limão') {
            return 0.10;
        }

        if (year <= 2000 && name === 'Maçã') {
            return 0.15;
        }

        if (year <= 2000 && name === 'Mamão') {
            return 0.80;
        }

        if (year <= 2000 && name === 'Manga') {
            return 0.31;
        }

        if (year <= 2000 && name === 'Maracujá') {
            return 0.15;
        }

        if (year <= 2000 && name === 'Marmelo') {
            return 0.19;
        }

        if (year <= 2000 && name === 'Pera') {
            return 0.17;
        }

        if (year <= 2000 && name === 'Pêssego') {
            return 0.13;
        }

        if (year <= 2000 && name === 'Tangerina') {
            return 0.15;
        }

        if (year <= 2000 && name === 'Melancia') {
            return 6.08;
        }

        if (year <= 2000 && name === 'Melão') {
            return 1.39;
        }

        return 1;
    }

    static getInflationCorrection(year) {
        if (year < 1994) {
            return 1;
        }
        let indexes = [8.0994, 7.7955, 1.5003, 28.8934, 12.0637, 11.8837, 35.4136, 6.2735, 14.6838, -0.9627, 4.3052, 9.4313, 9.7963, -4.0858, 13.8336, 4.1154, 9.1372, 5.0643, 2.1663, 10.8674, 7.7334, -2.5174, 9.3169, 9.6047];
        let i = 2019 - year;
        let J_i = 1;
        for (let k = 0; k < i; k++) {
            J_i = J_i * (1 + (indexes[indexes.length - 1 - k] / 100));
        }
        return J_i;
    }

    static async getStateProductionQuantities(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap).map(v => parseFloat(v)), quantity: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'quantity'] });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
            res[i].dataValues.quantity *= ProductionService.getQuantityTreatedFruit(res[i].dataValues.product, res[i].dataValues.year);
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionPlantedArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), plantedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'plantedArea'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionLostArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), plantedArea: { [Sequelize.Op.not]: [NaN, 0] }, harvestedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', [Sequelize.fn('sum', Sequelize.literal('(plantedArea - harvestedArea)/plantedArea')), 'lostArea']], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionHarvestedArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), harvestedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'harvestedArea'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionValueByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { value: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', 'value'],
            logging: false
        });

        let data = res.map(r => r.dataValues);
        const actualRes = groupBy(data, 'year,product', 'value');
        return actualRes;
    }

    static async getTotalProductionQuantityByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { quantity: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('quantity')), 'quantity']],
            logging: false
        });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.quantity *= ProductionService.getQuantityTreatedFruit(res[i].dataValues.product, res[i].dataValues.year);
        }
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionPlantedAreaByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('plantedArea')), 'plantedArea']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionLostAreaByYear(year) {
        const res = await Production.findAll({
            group: ['cityId'],
            where: { year: year, harvestedArea: { [Sequelize.Op.not]: [NaN, 0] }, plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: [
                'cityId',
                [Sequelize.fn('sum', Sequelize.literal('plantedArea')), 'totalPlantedArea'],
                [Sequelize.fn('sum', Sequelize.literal('harvestedArea')), 'totalHarvestedArea']
            ],
            logging: false
        });

        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.lostArea = (res[i].dataValues.totalPlantedArea - res[i].dataValues.totalHarvestedArea) / res[i].dataValues.totalPlantedArea;
            if (res[i].dataValues.lostArea < 0) {
                res[i].dataValues.lostArea = 0;
            }
        }
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionLostAreaByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { harvestedArea: { [Sequelize.Op.not]: [NaN, 0] }, plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['cityId', 'year', 'product', [Sequelize.fn('sum', Sequelize.literal('(plantedArea - harvestedArea)/plantedArea')), 'lostArea']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionHarvestedAreaByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { harvestedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('harvestedArea')), 'harvestedArea']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

    static async test() {
        const res = await Production.count({
            where: {
                year: {
                    [Sequelize.Op.lt]: 1991
                },
                value: [NaN, 0]
            }
        });
        return { res: res };
    }


};