import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { db } from "./lib/db";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email as string
                    }
                });
                if (!user || !user.hashedPassword) return null;
                const passwordsMatch = await bcrypt.compare(credentials.password as string, user.hashedPassword);
                if (passwordsMatch) return user;
                return null;
            }
        })
    ]
} satisfies NextAuthConfig;