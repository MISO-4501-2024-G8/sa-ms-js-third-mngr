const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pathEnv = `./env/.env.${process.env.NODE_ENVIRONMENT}`;
const healthController = require("./controllers/healthController");
const registerThirdController = require("./controllers/registerThirdController");


dotenv.config({ path: pathEnv });

const PORT =  process.env.PORT || 3000;
const DBData = {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'
}
console.log('DBData:', JSON.stringify(DBData));



const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(bodyParser.json());

app.use("/health", healthController);
app.use("/register", registerThirdController);


// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({ status: "OK" });
});

// HTML endpoint
app.get("/index", (req, res) => {
    const html = "<h1>Welcome to my API!</h1>";
    res.send(html);
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});



function initApp() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

initApp();

module.exports = app;