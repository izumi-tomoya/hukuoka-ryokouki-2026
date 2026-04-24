import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

// prisma オブジェクトが正しく初期化されているか確認
if (!prisma || !prisma.user) {
  console.error("Critical Error: PrismaClient is not properly initialized or 'user' model is missing.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  debug: process.env.NODE_ENV === "development",
});
