import Database from "better-sqlite3";
import HttpError from "../../helpers/HttpError.js";
import { serviceLogger } from "../../config/logConfig.js";
import { parseXlsAndSaveToDb } from "../fileParserServices/parseXlsAndSaveToDb.js";

const DB_INIT = process.env.DB_INIT || "false";

console.log("DB_INIT: ", DB_INIT);
serviceLogger.info(`DB initialize ENABLED: ${DB_INIT}`);

export const initializeDatabase = async () => {
  try {
    const db = new Database("database.sqlite");

    serviceLogger.info("Connected to SQLite database");
    if (DB_INIT === "true") {
      // Видалення існуючих таблиць, якщо вони вже є
      const dropTypesSchemaQuery = `DROP TABLE IF EXISTS types;`;
      db.exec(dropTypesSchemaQuery);

      const dropKatotgSchemaQuery = `DROP TABLE IF EXISTS katotg;`;
      db.exec(dropKatotgSchemaQuery);

      // Створюємо таблицю types
      const createTypesTableQuery = `
      CREATE TABLE IF NOT EXISTS types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL
      );
    `;
      db.exec(createTypesTableQuery);

      // Створюємо таблицю katotg
      const createKatotgTableQuery = `
      CREATE TABLE IF NOT EXISTS katotg (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        katotg TEXT NOT NULL,
        dps_name TEXT NOT NULL,
        adress TEXT NOT NULL,
        dps_code TEXT NOT NULL
      );
    `;
      db.exec(createKatotgTableQuery);

      await parseXlsAndSaveToDb(db);

      serviceLogger.info("Database tables initialized");
    }
    return db;
  } catch (error) {
    serviceLogger.error("Error details:", error);
    throw HttpError(500, "Failed to initialize the SQLite database");
  }
};
