import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { migrationLogger, serviceLogger } from "../../config/logConfig.js";
import HttpError from "../../helpers/HttpError.js";

export const xlsKatotgParse = async (db, xlsDirectory) => {
  try {
    const files = fs
      .readdirSync(xlsDirectory)
      .filter((file) => file.endsWith(".xlsx") || file.endsWith(".xls"));

    if (!files.length) {
      throw HttpError(
        400,
        "No XLS or XLSX files found in the 'katotg' directory"
      );
    }

    const xlsFilePath = path.resolve(xlsDirectory, files[0]);
    serviceLogger.debug(`FILE PATH (katotg): ${xlsFilePath}`);

    if (!fs.existsSync(xlsFilePath)) {
      throw HttpError(400, "XLS or XLSX file not found");
    }

    const workFile = xlsx.readFile(xlsFilePath);
    const worksheet = workFile.Sheets[workFile.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows.length) {
      serviceLogger.warn("XLS or XLSX file is empty or improperly formatted");
      throw HttpError(400, "XLS or XLSX file is empty or improperly formatted");
    }

    serviceLogger.info(`Parsed ${rows.length} rows from the XLS file (katotg)`);

    // Підготовка запиту для вставки даних у таблицю kved
    const insertKvedQuery = db.prepare(`
      INSERT INTO katotg (katotg, dps_name, adress, dps_code)
      VALUES (?, ?, ?, ?)
    `);

    migrationLogger.info(`Migration from file [${xlsFilePath}] started`);

    // Порядковий інсерт
    rows.forEach((row, index) => {
      insertKvedQuery.run(
        row["KATOTG"],
        row["DPS NAME"],
        row["ADRESS"],
        row["DPS CODE"]
      );
      migrationLogger.info(
        `Data inserted: ID: ${index + 1}, KATOTG: ${row["KATOTG"]}, DPS NAME: ${
          row["DPS NAME"]
        }, ADRESS: ${row["ADRESS"]}, DPS CODE: ${row["DPS CODE"]}`
      );
    });

    migrationLogger.info("Migration for 'katotg' completed");
  } catch (error) {
    serviceLogger.error(
      "Failed to parse XLS and insert data for 'katotg'",
      error
    );
    throw HttpError(500, "Failed to parse XLS and insert data for 'katotg'");
  }
};
