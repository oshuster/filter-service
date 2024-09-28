export const checkQueryParam = (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }
  next();
};
