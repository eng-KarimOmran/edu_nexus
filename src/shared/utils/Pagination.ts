export const buildPagination = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => ({
  take: limit,
  skip: Math.max(0, page - 1) * limit,
});

export const buildPaginationMeta = ({
  limit,
  count,
  page,
}: {
  limit: number;
  count: number;
  page: number;
}) => {
  const totalPages = Math.max(0, Math.ceil(count / limit));

  return {
    page,
    limit,
    total: count,
    totalPages,
  };
};