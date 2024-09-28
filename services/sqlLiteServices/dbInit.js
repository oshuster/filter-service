import Database from "better-sqlite3";
import HttpError from "../../helpers/HttpError.js";
import { serviceLogger } from "../../config/logConfig.js";
import { parseXlsAndSaveToDb } from "../fileParserServices/parseXlsAndSaveToDb.js";

export const initializeDatabase = async () => {
  try {
    const db = new Database("database.sqlite");

    serviceLogger.info("Connected to SQLite database");

    // Видалення існуючих таблиць, якщо вони вже є
    const dropTypesSchemaQuery = `DROP TABLE IF EXISTS types;`;
    db.exec(dropTypesSchemaQuery);

    const dropKvedSchemaQuery = `DROP TABLE IF EXISTS kved;`;
    db.exec(dropKvedSchemaQuery);

    // Створюємо таблицю types
    const createTypesTableQuery = `
      CREATE TABLE IF NOT EXISTS types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL
      );
    `;
    db.exec(createTypesTableQuery);

    // Створюємо таблицю kved
    const createKvedTableQuery = `
      CREATE TABLE IF NOT EXISTS kved (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        description TEXT NOT NULL,
        info TEXT
      );
    `;
    db.exec(createKvedTableQuery);

    await parseXlsAndSaveToDb(db);

    serviceLogger.info("Database tables initialized");
    return db;
  } catch (error) {
    serviceLogger.error("Error details:", error);
    throw HttpError(500, "Failed to initialize the SQLite database");
  }
};
