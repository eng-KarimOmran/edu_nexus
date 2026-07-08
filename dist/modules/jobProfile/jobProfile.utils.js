"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.buildJobProfileWhere = void 0;
const buildJobProfileWhere = ({ search, isActive, jobProfileType, supportType, }) => {
    const where = {};
    if (search) {
        where.OR = [
            { id: { contains: search } },
            {
                user: {
                    OR: [
                        {
                            name: {
                                contains: search,
                            },
                        },
                        {
                            phone: {
                                contains: search,
                            },
                        },
                    ],
                }
            }
        ];
    }
    if (typeof isActive === "boolean") {
        where.isActive = isActive;
    }
    if (jobProfileType) {
        where.jobProfileType = jobProfileType;
    }
    if (supportType) {
        where.supportType = { in: ["BOTH", supportType] };
    }
    return where;
};
exports.buildJobProfileWhere = buildJobProfileWhere;
exports.orderBy = {
    createdAt: "desc",
};
