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

export enum userRole {
  LEARNER = "learner",
  ADMIN = "admin",
  FACULTY = "manager",
}

export type problem = {
  id: number
  title: string
  difficulty: string
  isSolved: boolean
}