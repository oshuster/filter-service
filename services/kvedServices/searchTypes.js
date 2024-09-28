export const searchTypes = async (db, query) => {
  try {
    console.log("query", query);
    // Запит до бази даних для пошуку за типом і назвою
    const searchQuery = `
      SELECT id, type, name
      FROM types
      WHERE type LIKE ? OR name LIKE ?
    `;

    // Виконуємо запит до бази даних з шаблоном пошуку
    const results = db.prepare(searchQuery).all(`%${query}%`, `%${query}%`); // Використовуємо LIKE для пошуку за частковим збігом

    // Формуємо масив з об'єктами у форматі [{id: id, type: type, name: name}]
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
