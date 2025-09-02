// 🔹 Offset Pagination (page + limit + sort)
export const buildPagination = (query) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "timestamp",
    order = "desc",
    cursor,
  } = query;

  const pagination = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: order === "asc" ? 1 : -1 },
  };

  // If cursor exists → switch to cursor-based pagination
  if (cursor) {
    try {
      const decoded = decodeCursor(cursor);
      pagination.cursor = decoded;
    } catch (err) {
      throw new Error("Invalid cursor");
    }
  }

  return pagination;
};

// 🔹 Base64 JSON cursor encoder/decoder
export const encodeCursor = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");

export const decodeCursor = (str) =>
  JSON.parse(Buffer.from(str, "base64url").toString("utf-8"));
