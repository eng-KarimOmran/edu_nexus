"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.buildCourseWhere = void 0;
const buildCourseWhere = ({ academyId, search, isActive, }) => {
    const where = {
        academyId,
    };
    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                },
            },
            {
                description: {
                    contains: search,
                },
            },
        ];
    }
    if (typeof isActive !== "undefined") {
        where.isActive = isActive;
    }
    return where;
};
exports.buildCourseWhere = buildCourseWhere;
exports.orderBy = {
    createdAt: "desc",
};
