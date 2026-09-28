/**
 * Parse and normalize pagination parameters from request query
 */
export const getPagination = (query, defaultLimit = 12, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Format pagination metadata response
 */
export const formatPaginationResponse = (totalDocs, page, limit) => {
  const totalPages = Math.ceil(totalDocs / limit) || 1;

  return {
    totalDocs,
    limit,
    page,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
};

export default {
  getPagination,
  formatPaginationResponse,
};
