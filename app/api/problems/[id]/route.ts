import {
  deleteProblem,
  getProblemById,
} from "@/repository/problem.repository";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const problem = await getProblemById(params.id);

    if (!problem) {
      return new Response(JSON.stringify({ error: "Problem not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(problem), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch problem" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteProblem(params.id);

    if (!result) {
      return new Response(JSON.stringify({ error: "Problem not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({ message: "Problem deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting problem:", error);
    return new Response(JSON.stringify({ error: "Failed to delete problem" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
