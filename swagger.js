const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Swagger API documentation for Todo list API',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ],
    },
    apis: ['./routes/main.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;