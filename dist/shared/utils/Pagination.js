"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.buildPagination = void 0;
const buildPagination = ({ page = 1, limit = 10, }) => ({
    take: limit,
    skip: Math.max(0, page - 1) * limit,
});
exports.buildPagination = buildPagination;
const buildPaginationMeta = ({ limit, count, page, }) => {
    const totalPages = Math.max(0, Math.ceil(count / limit));
    return {
        page,
        limit,
        total: count,
        totalPages,
    };
};
exports.buildPaginationMeta = buildPaginationMeta;
