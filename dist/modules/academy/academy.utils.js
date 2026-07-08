"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeAcademy = exports.buildAcademyWhere = void 0;
const user_utils_1 = require("../user/user.utils");
const buildAcademyWhere = ({ search, }) => {
    const where = {};
    if (search) {
        where.OR = [
            { id: { startsWith: search, } },
            { name: { contains: search, } },
        ];
    }
    return where;
};
exports.buildAcademyWhere = buildAcademyWhere;
const sanitizeAcademy = (academy) => {
    return { ...academy, owners: academy.owners.map((u) => (0, user_utils_1.userSafe)(u)) };
};
exports.sanitizeAcademy = sanitizeAcademy;
