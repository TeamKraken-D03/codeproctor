import sql from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const offset = (page - 1) * pageSize;
    
    // Validate sortBy to prevent SQL injection
    const allowedSortColumns = ["id", "name", "email", "role"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let users, totalResult;

    if (search) {
      // Search with pagination and sorting
      const searchPattern = `%${search}%`;
      
      users = await sql`
        SELECT id, name, email, role FROM users
        WHERE name ILIKE ${searchPattern} OR email ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count for search
      totalResult = await sql`
        SELECT COUNT(*) as count FROM users
        WHERE name ILIKE ${searchPattern} OR email ILIKE ${searchPattern}
      `;
    } else {
      // No search, just pagination and sorting
      users = await sql`
        SELECT id, name, email, role FROM users
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count
      totalResult = await sql`SELECT COUNT(*) as count FROM users`;
    }

    const total = parseInt(totalResult[0].count);

    return Response.json({
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });

  } catch (e) {
    console.error("Error fetching users:", e);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
