import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as configENV } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import api from "./api";
import ApiError from "./lib/ApiError";
import { connect as connectDB, url, Url } from "./lib/mongoose";
import log from "./lib/requestLog";

configENV();

const app = express();

connectDB();

//* middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(log));
app.use(cookieParser());

//* routes
app.use("/api", api);

//* error handler
app.use(ApiError.Handler);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.redirect("//app.krsz.me");
});
app.all("/test", (req, res) => {
    const { headers, body, params, query, cookies, method, ip, path } = req;
    res.json({ headers, body, params, query, cookies, method, ip, path });
});

//* redirect to code
app.get("/:code", async (req, res) => {
    const dest: url = await Url.findById(req.params.code);

    if (!dest) return res.status(404).send("link not found");

    res.redirect(301, dest.dest);

    await dest.updateOne({ clicks: dest.clicks + 1 });
});

app.listen(PORT, () => {
    console.log(`> app online on ${chalk.blue(PORT)}`);
});
