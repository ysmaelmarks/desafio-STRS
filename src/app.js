import express from "express";
import cors from "cors"
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import db from "./db/config.js";
import router from "./routes/router.js";


const swaggerDocument = YAML.load("./swagger.yaml");

db.on("error", (err) => {
    console.log(`db error: ${err}`)
})
db.on("open", () => {
    console.log(`db working`)
})

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000"
}));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);


export default app;
