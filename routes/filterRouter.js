import express from "express";
import { logRequest } from "../config/logConfig.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { typeController } from "../controllers/typeController.js";
import { checkQueryParam } from "../helpers/checkQueryParams.js";
import { katotgController } from "../controllers/katotgController.js";

const filterRouter = express.Router();

filterRouter.use(logRequest);

filterRouter.get("/type", checkQueryParam, ctrlWrapper(typeController));

filterRouter.get("/katotg", checkQueryParam, ctrlWrapper(katotgController));

export default filterRouter;
