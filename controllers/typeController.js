import { searchTypes } from "../services/kvedServices/searchTypes.js";

export const typeController = async (req, res) => {
  const result = await searchTypes(req.db, req.query.q);
  res.json(result);
};
