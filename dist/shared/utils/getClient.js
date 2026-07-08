"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const getClient = (tx) => tx ?? prisma_1.prisma;
exports.default = getClient;
