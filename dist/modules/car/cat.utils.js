"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.buildCarWhere = void 0;
const buildCarWhere = ({ search, gearType, isActive, }) => {
    const where = {};
    if (search) {
        where.OR = [
            { modelName: { contains: search, } },
            { plateNumber: { contains: search, } },
        ];
    }
    if (gearType) {
        where.gearType = gearType;
    }
    if (typeof isActive !== "undefined") {
        where.isActive = isActive;
    }
    return where;
};
exports.buildCarWhere = buildCarWhere;
exports.orderBy = {
    createdAt: "desc",
};
