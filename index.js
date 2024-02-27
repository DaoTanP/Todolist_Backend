require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const mainRoute = require('./routes/main');
const swaggerSpec = require('./swagger');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true }));

app.use('/', mainRoute);

app.listen(process.env.PORT, (req, res) => {
    console.log('listening on port: ' + process.env.PORT);
});