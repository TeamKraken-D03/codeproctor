import { createProblem, getProblemsWithPagination } from "@/repository/problem.repository";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const result = await getProblemsWithPagination(page, pageSize, search, sortBy, sortOrder);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error fetching problems:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch problems" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    const newProblem: createProblem = await req.json();

    // Validate required fields
    if (!newProblem.problemid || !newProblem.title || !newProblem.description) {
      return new Response(
        JSON.stringify({
          error: "problemid, title, and description are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Add the creator's ID from the session (which should be a UUID)
    // Only assign if it's a valid UUID to avoid type conversion errors
    if (session.user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id)) {
      newProblem.created_by = session.user.id;
    } else {
      // If no valid UUID is found, set to null
      newProblem.created_by = null;
    }

    const res = await createProblem(newProblem);
    console.log(res);
    return new Response(
      JSON.stringify({ message: "Problem created successfully", problem: res }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating problem:", error);
    return new Response(JSON.stringify({ error: "Failed to create problem" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE() {}

export async function PATCH() {}
