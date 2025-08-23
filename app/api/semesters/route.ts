import { NextRequest } from "next/server";
import {
  getSemestersWithPagination,
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

    const result = await getSemestersWithPagination(page, pageSize, search, sortBy, sortOrder);

    return new Response(JSON.stringify(result), {
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
