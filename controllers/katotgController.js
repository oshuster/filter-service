import { searchKatotg } from "../services/katotgServices/searchKatotg.js";

export const katotgController = async (req, res) => {
  try {
    const result = await searchKatotg(req.db, req.query.q);

    res.json(result);
  } catch (error) {
    console.error("Error in katotgController:", error);
    res.status(500).json({ error: "Failed to search katotg" });
  }
};
