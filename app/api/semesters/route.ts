import { NextRequest } from "next/server";
import sql from "@/lib/db";
import {
  createSemester,
  editSemester,
  deleteSemester,
} from "@/repository/semester.repository";

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
    const allowedSortColumns = ["id", "name", "year"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let semesters, totalResult;

    if (search) {
      // Search with pagination and sorting
      const searchPattern = `%${search}%`;
      
      semesters = await sql`
        SELECT id, name, year FROM semesters
        WHERE name ILIKE ${searchPattern} OR year::text ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count for search
      totalResult = await sql`
        SELECT COUNT(*) as count FROM semesters
        WHERE name ILIKE ${searchPattern} OR year::text ILIKE ${searchPattern}
      `;
    } else {
      // No search, just pagination and sorting
      semesters = await sql`
        SELECT id, name, year FROM semesters
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count
      totalResult = await sql`SELECT COUNT(*) as count FROM semesters`;
    }

    const total = parseInt(totalResult[0].count);

    return new Response(JSON.stringify({
      data: semesters,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching semesters:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch semesters" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await createSemester(body);

    if (res.success) {
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify(res), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e: Error | any) {
    return new Response(
      JSON.stringify({ error: e.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Semester ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const res = await deleteSemester(id);

    if (res.success) {
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify(res), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e: Error | any) {
    return new Response(
      JSON.stringify({ error: e.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const res = await editSemester(body);

    if (res.success) {
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify(res), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e: Error | any) {
    return new Response(
      JSON.stringify({ error: e.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
