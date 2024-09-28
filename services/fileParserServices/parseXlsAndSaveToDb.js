import { xlsTypeParse } from "./xlsTypeParser.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { serviceLogger } from "../../config/logConfig.js";
import HttpError from "../../helpers/HttpError.js";

export const parseXlsAndSaveToDb = async (db) => {
  try {
    let xlsTypePath;

    // DEVELOPMENT mode
    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      // Вказуємо абсолютний шлях до файлу XLS
      xlsTypePath = path.resolve(__dirname, "../../inputFiles/type/");
      serviceLogger.debug(`XLS TYPE File Path (Development): ${xlsTypePath}`);

      await xlsTypeParse(db, xlsTypePath);
    }

    // PRODUCTION mode
    if (process.env.ENVIRONMENT === "PRODUCTION") {
      const typeDirectory = process.env.XLS_TYPE_PATH || "./inputFiles/type/";
      serviceLogger.debug(`XLS TYPE Directory: ${typeDirectory}`);

      const kvedDirectory = process.env.XLS_KVED_PATH || "./inputFiles/kved/";
      serviceLogger.debug(`XLS KVED Directory: ${kvedDirectory}`);

      await xlsTypeParse(db, typeDirectory);
      // TODO
      // await processKvedFile(db, kvedDirectory);
    }

    serviceLogger.info("XLS files parsed and data inserted into the database");
  } catch (error) {
    serviceLogger.error("Failed to parse XLS and insert data", error);
    throw HttpError(500, "Failed to parse XLS and insert data");
  }
};
