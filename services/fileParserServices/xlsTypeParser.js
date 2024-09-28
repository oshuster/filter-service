import xlsx from "xlsx";
import fs from "fs";
import HttpError from "../../helpers/HttpError.js";
import path from "path";
import { migrationLogger, serviceLogger } from "../../config/logConfig.js";
import { cleanStringFromXLS } from "../../helpers/cleanStringFromXLS.js";

export const xlsTypeParse = async (db, xlsDirectory) => {
  try {
    // Пошук файлів з розширенням .xls у вказаній директорії
    const files = fs
      .readdirSync(xlsDirectory)
      .filter((file) => file.endsWith(".xls"));

    if (!files.length) {
      throw HttpError(400, "No XLS files found in the 'type' directory");
    }

    const xlsFilePath = path.resolve(xlsDirectory, files[0]); // Беремо перший XLS файл
    serviceLogger.debug(`FILE PATH (type): ${xlsFilePath}`);

    if (!fs.existsSync(xlsFilePath)) {
      throw HttpError(400, "XLS file not found");
    }

    const workFile = xlsx.readFile(xlsFilePath);
    const worksheet = workFile.Sheets[workFile.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows.length) {
      serviceLogger.warn("XLS file is empty or improperly formatted");
      throw HttpError(400, "XLS file is empty or improperly formatted");
    }

    serviceLogger.info(`Parsed ${rows.length} rows from the XLS file (type)`);

    // праметри для інсерту
    const insertTypesQuery = db.prepare(`
      INSERT INTO types (type, name)
      VALUES (?, ?)
    `);

    migrationLogger.info(`Migration from file [${xlsFilePath}] started`);

    // Порядковий інсерт
    rows.forEach((row, index) => {
      const cleanedType = cleanStringFromXLS(row['"TYPE"']);
      const cleanedName = cleanStringFromXLS(row['"NAME_OBJ"']);

      if (!cleanedType || !cleanedName) {
        migrationLogger.warn(
          `Skipping row with missing fields: ${JSON.stringify(row)}`
        );
        return;
      }
      insertTypesQuery.run(cleanedType, cleanedName);
      migrationLogger.info(
        `Data inserted: ID: ${
          index + 1
        }, TYPE: ${cleanedType}, NAME: ${cleanedName}`
      );
    });

    migrationLogger.info("Migration for 'types' completed");
  } catch (error) {
    serviceLogger.error(
      "Failed to parse XLS and insert data for 'types'",
      error
    );
    throw HttpError(500, "Failed to parse XLS and insert data for 'types'");
  }
};
