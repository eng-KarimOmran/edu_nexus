import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import { prisma } from "../../lib/prisma";

const getClient = (tx?: TransactionClient) => tx ?? prisma;

export default getClient