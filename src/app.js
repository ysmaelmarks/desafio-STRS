import express from "express";
import cors from "cors"
import db from "./db/config.js";
import router from "./routes/router.js";

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
app.use(router);


export default app;
