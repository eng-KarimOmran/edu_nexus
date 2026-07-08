import env from "../config/env";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/prisma/generated/client";

const adapter = new PrismaMariaDb(env.db.URL_DB);

export const prisma = new PrismaClient({
    adapter,
});