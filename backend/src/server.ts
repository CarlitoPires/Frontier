/* LinguoBound — API entrypoint */
import express from "express";
import { router } from "./routes";

const app = express();
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`LinguoBound API listening on :${PORT}`));
