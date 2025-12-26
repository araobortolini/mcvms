import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      isBlocked: boolean
      blockTree: boolean
      impersonatedBy?: any
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    isBlocked: boolean
    blockTree: boolean
    resellerBlockTree?: boolean
    permissions?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isBlocked: boolean
    blockTree: boolean
    resellerBlockTree?: boolean
    impersonatedBy?: any
  }
}
