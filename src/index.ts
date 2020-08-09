import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () =>
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
);
