import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./config/database";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter, permissionRouter, roleRouter, userRouter } from "./routes/index";
import { rateLimiter } from "./utils/rate-limit";
import { swaggerSpec , swaggerUi } from "./services/swagger/swagger";
dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(helmet()); // secure headers
app.use(morgan("tiny")) // http request logger
app.use(rateLimiter()); // IP rate limiter

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // API Documentation Setup using swagger

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/roles" , roleRouter);
app.use("/api/v1/permissions" , permissionRouter);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Invalid path" });
});

dbConnection();

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Backend server is running on port " + port);
});
