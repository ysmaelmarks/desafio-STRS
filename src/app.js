import express from "express";
import cors from "cors"
import db from "./db/config.js";

db.on("error", (err) => {
    console.log(`db error: ${err}`)
})
db.on("open", () => {
    console.log(`db working`)
})

const app = express();
app.use(cors({
    origin: "http:localhost:3000"
}))
app.use(express.json())

export default app;
