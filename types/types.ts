import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    userRole: string;
  }
}

export type user = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type semester = {
  id: string;
  name: string;
  year: string;
};

export type department = {
  id: string;
  name: string;
};

export type section = {
  id: string;
  name: string;
  userid: string;
  semesterid: string;
  departmentid: string;
  isactive: boolean;
};

export type problem = {
  id: string;
  title: string;
  description: string;
  created_by?: string;
};
