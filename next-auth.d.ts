import { Permissions, UserRole } from "@prisma/client";
import NextAuth, { User, type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role?: UserRole;
  id?: string;
  permissions?: Permissions
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
