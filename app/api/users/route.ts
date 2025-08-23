import { NextRequest } from "next/server";
import { getUsersWithPagination } from "@/repository/user.repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const result = await getUsersWithPagination(page, pageSize, search, sortBy, sortOrder);

    return Response.json(result);

  } catch (e) {
    console.error("Error fetching users:", e);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
