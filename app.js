import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { serviceLogger } from "./config/logConfig.js";
import filterRouter from "./routes/filterRouter.js";
import { initializeDatabase } from "./services/sqlLiteServices/dbInit.js";

const HTTP_PORT = process.env.PORT || 3344;
const app = express();

const startServer = async () => {
  try {
    // створення БД
    const db = await initializeDatabase();
    // парсимо exel
    // Якщо база успішно створена, налаштовуємо сервер
    app.use(morgan("tiny"));
    app.use(
      cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
      })
    );
    app.use(express.json());

    app.use(
      "/api/filter",
      (req, res, next) => {
        req.db = db; // Передаємо екземпляр бази даних в маршрути
        next();
      },
      filterRouter
    );

    app.use((_, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      const { status = 500, message = "Server error" } = err;
      res.status(status).json({ message });
    });

    app.listen(HTTP_PORT, () => {
      serviceLogger.info(
        `HTTP Server is running. Use our API on port: ${HTTP_PORT}`
      );
      console.log(`HTTP Server is running. Use our API on port: ${HTTP_PORT}`);
    });
  } catch (error) {
    // Логуємо та виводимо помилку, якщо база даних не створилася
    serviceLogger.error("Failed to start the server", error);
    console.error("Failed to start the server", error);
  }
};

startServer();
