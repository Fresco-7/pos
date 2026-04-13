import NextAuth, { User } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { Permissions, UserRole } from "@prisma/client";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    update,
} = NextAuth({
    pages: {
        signIn: "/",
    },
    callbacks: {
        async session({ token, session }) {

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            if (token.permissions && session.user) {
                session.user.permissions = token.permissions as Permissions;
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const dbUser = await db.user.findFirst({
                where: {
                    id: token.sub
                }, include : {
                    Employee : true
                }
            })

            if (!dbUser) {
                return token
            }

            token.name = dbUser.name;
            token.email = dbUser.email;
            token.role = dbUser.role;
            if(dbUser.Employee){
                token.permissions = dbUser.Employee.permissions
            }

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
});