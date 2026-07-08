"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const env_1 = __importDefault(require("../config/env"));
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const client_1 = require("../prisma/generated/client");
const adapter = new adapter_mariadb_1.PrismaMariaDb(env_1.default.db.URL_DB);
exports.prisma = new client_1.PrismaClient({
    adapter,
});
