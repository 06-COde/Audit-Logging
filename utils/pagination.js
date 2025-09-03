export const buildPagination = (query, total = null) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "timestamp",
    order = "desc",
    cursor,
  } = query;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const sortOrder = order === "asc" ? 1 : -1;

  const pagination = {
    page: parsedPage,
    limit: parsedLimit,
    sort: { [sortBy]: sortOrder },
    cursor: null,
    // Meta (default, may be overridden later in controller)
    meta: {
      total: total ?? null,
      pages: total ? Math.ceil(total / parsedLimit) : null,
      hasPrevPage: parsedPage > 1,
      hasNextPage: total ? parsedPage < Math.ceil(total / parsedLimit) : null,
      prevPage: parsedPage > 1 ? parsedPage - 1 : null,
      nextPage: total && parsedPage < Math.ceil(total / parsedLimit) ? parsedPage + 1 : null,
      prevCursor: null,
      nextCursor: null,
    },
  };

  // If cursor exists → switch to cursor-based pagination
  if (cursor) {
    try {
      const decoded = decodeCursor(cursor);
      pagination.cursor = decoded;

      // When cursor-based, we don’t know total pages
      pagination.meta = {
        total: null,
        pages: null,
        hasPrevPage: false, // usually handled differently in cursor
        hasNextPage: true,  // assume true until proven false in controller
        prevPage: null,
        nextPage: null,
        prevCursor: null,
        nextCursor: null,
      };
    } catch (err) {
      throw new Error("Invalid cursor");
    }
  }

  return pagination;
};

// 🔹 Base64 JSON cursor encoder/decoder
export const encodeCursor = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");