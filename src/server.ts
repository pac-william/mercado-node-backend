import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config({
    quiet: true,
});

const app = express();

app.use(cors({}));
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});