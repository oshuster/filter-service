import { xlsTypeParse } from "./xlsTypeParser.js";
import { xlsKatotgParse } from "./xlsKatotgParser.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import HttpError from "../../helpers/HttpError.js";
import { serviceLogger } from "../../config/logConfig.js";

export const parseXlsAndSaveToDb = async (db) => {
  try {
    let xlsTypePath;
    let xlsKatotgPath;

    // DEVELOPMENT mode
    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      // TYPE
      xlsTypePath = path.resolve(__dirname, "../../inputFiles/type/");
      serviceLogger.debug(`XLS TYPE File Path (Development): ${xlsTypePath}`);
      // KATOTG
      xlsKatotgPath = path.resolve(__dirname, "../../inputFiles/katotg/");
      serviceLogger.debug(`XLS TYPE File Path (Development): ${xlsKatotgPath}`);

      await xlsTypeParse(db, xlsTypePath);
      await xlsKatotgParse(db, xlsKatotgPath);
    }

    // PRODUCTION mode
    if (process.env.ENVIRONMENT === "PRODUCTION") {
      const typeDirectory = process.env.XLS_TYPE_PATH || "./inputFiles/type/";
      serviceLogger.debug(`XLS TYPE Directory: ${typeDirectory}`);

      const katotgDirectory =
        process.env.XLS_KATOTG_PATH || "./inputFiles/katotg/";
      serviceLogger.debug(`XLS KATOTG Directory: ${katotgDirectory}`);

      await xlsTypeParse(db, typeDirectory);
      await xlsKatotgParse(db, katotgDirectory);
    }

    serviceLogger.info("XLS files parsed and data inserted into the database");
  } catch (error) {
    serviceLogger.error("Failed to parse XLS and insert data", error);
    throw HttpError(500, `Failed to parse XLS and insert data, ${error}`);
  }
};
