import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      userRole?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    userRole: string
  }
}

export type user = {
    id: string,
    name: string,
    email: string,
    role: string,
}

export type semester = {
  id: string,
  name: string,
  year: string,
}

export type department = {
  id: string,
  name: string
}