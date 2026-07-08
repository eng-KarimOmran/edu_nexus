"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.buildAreaWhere = void 0;
const buildAreaWhere = ({ search, isActive, supportType, }) => {
    const where = {};
    if (search) {
        where.OR = [
            { id: { startsWith: search, } },
            { name: { contains: search, } },
        ];
    }
    if (typeof isActive !== "undefined") {
        where.isActive = isActive;
    }
    if (supportType) {
        where.supportType = {
            in: ["BOTH", supportType],
        };
    }
    return where;
};
exports.buildAreaWhere = buildAreaWhere;
exports.orderBy = {
    createdAt: "desc",
};
