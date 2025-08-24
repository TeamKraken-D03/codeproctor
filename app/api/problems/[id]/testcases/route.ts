import {
  createAndAssignTestcase,
  getTestCasesByProblemId,
} from "@/repository/testcases.repository";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const newTestCase = await req.json();
  await createAndAssignTestcase(id, newTestCase);
  return new Response(
    JSON.stringify({ message: "Test case created successfully" }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const testCases = await getTestCasesByProblemId(id);
  return new Response(
    JSON.stringify(testCases),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
