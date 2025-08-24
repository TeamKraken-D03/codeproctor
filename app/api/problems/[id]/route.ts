import {
  deleteProblem,
  getProblemById,
  editProblem,
} from "@/repository/problem.repository";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    // Await the entire params object before accessing its properties
    const params = await context.params;
    const id = params.id;
    
    const problem = await getProblemById(id);

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
  context: { params: { id: string } }
) {
  try {
    // Await the entire params object before accessing its properties
    const params = await context.params;
    const id = params.id;
    
    const result = await deleteProblem(id);

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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    params = await params;
    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedProblem = await editProblem(params.id, { title, description });

    if (!updatedProblem) {
      return new Response(JSON.stringify({ error: "Problem not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(updatedProblem), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return new Response(JSON.stringify({ error: "Failed to update problem" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
