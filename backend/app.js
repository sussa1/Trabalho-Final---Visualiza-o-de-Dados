import database from './db.js';
import City from './models/city.js';
import Production from './models/production.js';
import express from 'express';
import CityService from './services/city-service.js';
import ProductionService from './services/production-service.js';
import swaggerFile from './swagger.json' assert {type: "json"};
import swaggerUi from 'swagger-ui-express';
import Cors from 'cors';

(async () => {

    try {
        const resultado = await database.sync();
        console.log(resultado);
    } catch (error) {
        console.log(error);
    }
})();

const app = express();
const port = 3000;

app.use(Cors())

app.post('/fillDatabase', async (req, res) => {
    await CityService.fillData();
    await ProductionService.fillData('lavouras');
    res.send('Processed!');
});

app.get('/state/value', async (req, res) => {
    const stateCode = req.query.stateCode;
    ProductionService.getStateProductionValues(stateCode).then(v => {
        res.send(v);
    });
});

app.get('/state/quantity', async (req, res) => {
    const stateCode = req.query.stateCode;
    ProductionService.getStateProductionQuantities(stateCode).then(v => {
        res.send(v);
    });
});

app.get('/state/plantedArea', async (req, res) => {
    const stateCode = req.query.stateCode;
    ProductionService.getStateProductionPlantedArea(stateCode).then(v => {
        res.send(v);
    });
});

app.get('/state/lostArea', async (req, res) => {
    const stateCode = req.query.stateCode;
    ProductionService.getStateProductionLostArea(stateCode).then(v => {
        res.send(v);
    });
});

app.get('/state/harvestedArea', async (req, res) => {
    const stateCode = req.query.stateCode;
    ProductionService.getStateProductionHarvestedArea(stateCode).then(v => {
        res.send(v);
    });
});

app.get('/value', async (req, res) => {
    ProductionService.getTotalProductionValueByProduct().then(v => {
        res.send(v);
    });
});

app.get('/quantity', async (req, res) => {
    ProductionService.getTotalProductionQuantityByProduct().then(v => {
        res.send(v);
    });
});

app.get('/plantedArea', async (req, res) => {
    ProductionService.getTotalProductionPlantedAreaByProduct().then(v => {
        res.send(v);
    });
});

app.get('/harvestedArea', async (req, res) => {
    ProductionService.getTotalProductionHarvestedAreaByProduct().then(v => {
        res.send(v);
    });
});

app.get('/lostArea', async (req, res) => {
    ProductionService.getTotalProductionLostAreaByProduct().then(v => {
        res.send(v);
    });
});

app.get('/lostArea/year', async (req, res) => {
    const year = req.query.year;
    ProductionService.getTotalProductionLostAreaByYear(year).then(v => {
        res.send(v);
    });
});

app.get('/test', async (req, res) => {
    ProductionService.test().then(v => {
        res.send(v);
    });
});

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile)
);


app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});
