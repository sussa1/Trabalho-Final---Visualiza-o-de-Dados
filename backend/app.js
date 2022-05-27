import database from './db.js';
import City from './models/city.js';
import Production from './models/production.js';
import express from 'express';
import CityService from './services/city-service.js';
import ProductionService from './services/production-service.js';
import swaggerFile from './swagger.json' assert {type: "json"};
import swaggerUi from 'swagger-ui-express';

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

app.post('/fillDatabase', async (req, res) => {
    await CityService.fillData();
    for (let i = 1974; i <= 2020; i++) {
        await ProductionService.fillData(i);
    }
    res.send('Processed!');
});

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile)
);


app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});
