import { createProblem, getAllProblems } from "@/repository/problem.repository";

export async function GET() {
  const problems = await getAllProblems();
  return new Response(JSON.stringify(problems), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: Request) {
  try {
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
