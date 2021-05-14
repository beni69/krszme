import express from "express";
import { join as joinPath } from "path";

const PORT = process.env.PORT || 8080;

const app = express();

app.use("/app", express.static(joinPath(__dirname, "../../next/out"), {}));

app.get("/", (req, res) => {
    res.redirect("/app");
});

app.listen(PORT, () => {
    console.log(`> app online on ${PORT}`);
});
