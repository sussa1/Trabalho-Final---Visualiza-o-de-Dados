(async () => {
    const database = require('./db');
    const City = require('./models/city');
    const Production = require('./models/production');

    try {
        const resultado = await database.sync();
        console.log(resultado);
    } catch (error) {
        console.log(error);
    }
})();

const express = require('express');
const app = express();
const port = 3000;

const CityService = require('./services/city-service')
const ProductionService = require('./services/production-service')

app.post('/fillDatabase', async (req, res) => {
    await new CityService().fillData()
    await new ProductionService().fillData();
    res.send('Processed!');
});

const swaggerFile = require('./swagger.json')
const swaggerUi = require('swagger-ui-express');
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile)
);


app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});
