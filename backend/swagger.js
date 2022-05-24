const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles)