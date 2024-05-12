const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pathEnv = `./env/.env.${process.env.NODE_ENVIRONMENT}`;

console.log('pathEnv:', pathEnv);
dotenv.config({ path: pathEnv });
const PORT = process.env.PORT || 3000;
const DBData = {
    database: process.env.DB_DATABASE || "db_user",
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "c5d5e19030104ba38e131c2ee8e76dec",
    host: process.env.DB_HOST || "dbsportapprestore.cvweuasge1pc.us-east-1.rds.amazonaws.com",
    dialect: process.env.DB_DIALECT || "mysql"
}
console.log('DBData:', JSON.stringify(DBData));
const healthController = require("./controllers/HealthController");
const registerThirdController = require("./controllers/RegisterThirdController");
const thirdProductController = require("./controllers/ThirdProductController");
const trainerDoctorController = require("./controllers/TrainerDoctorController");
const consultationController = require("./controllers/ConsultationController");

const app = express();
app.disable("x-powered-by");
app.use(cors({
    origin: '*' //NOSONAR
}));
app.use(express.json());
app.use(bodyParser.json());

app.use("/health", healthController);
app.use("/register", registerThirdController);
app.use("/third", thirdProductController);
app.use("/sportsSpecialist", trainerDoctorController);
app.use("/consultation", consultationController);
// Health check endpoint

app.get("/", (req, res) => {
    res.status(200).json({ status: "OK", code: 200 });
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found", code: 404 });
});

function initApp() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

initApp();

module.exports = app;