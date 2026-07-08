"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobProfileSelect = void 0;
exports.jobProfileSelect = {
    id: true,
    user: {
        select: {
            id: true,
            name: true,
            phone: true,
        },
    },
    wallets: {
        select: {
            id: true,
            balance: true,
            academy: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
};
