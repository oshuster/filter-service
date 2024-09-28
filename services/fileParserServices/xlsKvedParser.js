import { migrationLogger } from "../../config/logConfig.js";

// Майбутня функція для обробки файлів з каталогу "kved" і запису даних у таблицю "kved"
export const xlsKvedParse = async (db, xlsDirectory) => {
  try {
    const files = fs
      .readdirSync(xlsDirectory)
      .filter((file) => file.endsWith(".xls"));

    if (!files.length) {
      throw HttpError(400, "No XLS files found in the 'kved' directory");
    }

    const xlsFilePath = path.resolve(xlsDirectory, files[0]);
    serviceLogger.debug(`FILE PATH (kved): ${xlsFilePath}`);

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

    serviceLogger.info(`Parsed ${rows.length} rows from the XLS file (kved)`);

    // Підготовка запиту для вставки даних у таблицю kved
    const insertKvedQuery = db.prepare(`
      INSERT INTO kved (code, description, info)
      VALUES (?, ?, ?)
    `);

    migrationLogger.info(`Migration from file [${xlsFilePath}] started`);

    // Порядковий інсерт
    rows.forEach((row, index) => {
      const cleanedCode = cleanStringFromXLS(row['"CODE"']);
      const cleanedDescription = cleanStringFromXLS(row['"DESCRIPTION"']);
      const cleanedInfo = cleanStringFromXLS(row['"INFO"'] || "");

      if (!cleanedCode || !cleanedDescription) {
        migrationLogger.warn(
          `Skipping row with missing fields: ${JSON.stringify(row)}`
        );
        return;
      }
      insertKvedQuery.run(cleanedCode, cleanedDescription, cleanedInfo);
      migrationLogger.info(
        `Data inserted: ID: ${
          index + 1
        }, CODE: ${cleanedCode}, DESCRIPTION: ${cleanedDescription}`
      );
    });

    migrationLogger.info("Migration for 'kved' completed");
  } catch (error) {
    serviceLogger.error(
      "Failed to parse XLS and insert data for 'kved'",
      error
    );
    throw HttpError(500, "Failed to parse XLS and insert data for 'kved'");
  }
};
