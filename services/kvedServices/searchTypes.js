export const searchTypes = async (db, query) => {
  try {
    const normalizedQuery = query.toUpperCase();

    const searchQuery = `
      SELECT id, type, name
      FROM types
      WHERE name LIKE ? COLLATE NOCASE
    `;

    const results = db.prepare(searchQuery).all(`%${normalizedQuery}%`);

    // [{id: id, type: type, name: name}]
    const formattedResults = results.map((row) => ({
      id: row.id,
      type: row.type,
      name: row.name,
    }));

    return formattedResults;
  } catch (error) {
    console.error("Failed to search types", error);
    throw new Error("Failed to search types");
  }
};
