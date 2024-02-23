import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";

//routes
import houseRouter from "./routes/houseRouter.js";

//middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/houses", houseRouter);

const port = process.env.PORT || 5500;

try {
  await mongoose.connect(process.env.MONGO_URL);

  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
