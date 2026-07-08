"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.buildClientWhere = void 0;
const buildClientWhere = ({ academyId, search, source, }) => {
    const where = { academyId };
    if (search) {
        where.OR = [
            {
                id: { contains: search }
            },
            {
                name: { contains: search, }
            },
            {
                phone: { contains: search }
            }
        ];
    }
    if (source) {
        where.source = source;
    }
    return where;
};
exports.buildClientWhere = buildClientWhere;
exports.orderBy = {
    createdAt: "desc",
};
