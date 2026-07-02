import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global._prisma) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
    global._prisma = new PrismaClient();
  }
  return global._prisma;
}
