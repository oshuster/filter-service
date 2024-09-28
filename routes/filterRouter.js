import express from "express";
import { logRequest } from "../config/logConfig.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { typeController } from "../controllers/typeController.js";
import { kvedController } from "../controllers/kvedController.js";
import { checkQueryParam } from "../helpers/checkQueryParams.js";

const filterRouter = express.Router();

filterRouter.use(logRequest);

filterRouter.get("/type", checkQueryParam, ctrlWrapper(typeController));

filterRouter.get("/kved", checkQueryParam, ctrlWrapper(kvedController));

export default filterRouter;
