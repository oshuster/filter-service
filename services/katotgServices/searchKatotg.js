export const searchKatotg = async (db, query) => {
  try {
    const normalizedQuery = query.toUpperCase();

    const searchQuery = `
      SELECT id, katotg, dps_name, adress, dps_code
      FROM katotg
      WHERE dps_name LIKE ? COLLATE NOCASE
      OR dps_code LIKE ? COLLATE NOCASE
      OR adress LIKE ? COLLATE NOCASE
    `;

    const results = db
      .prepare(searchQuery)
      .all(
        `%${normalizedQuery}%`,
        `%${normalizedQuery}%`,
        `%${normalizedQuery}%`
      );

    // [{id:id, katotg:katotg, dps_name:dps_name, adress:adress, dps_code:dps_code}]
    const formattedResults = results.map((row) => ({
      id: row.id,
      katotg: row.katotg,
      dps_name: row.dps_name,
      adress: row.adress,
      dps_code: row.dps_code,
    }));

    return formattedResults;
  } catch (error) {
    console.error("Failed to search katotg", error);
    throw new Error("Failed to search katotg");
  }
};
