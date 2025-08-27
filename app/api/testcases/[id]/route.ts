import { deleteTestCase } from "@/repository/testcases.repository";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const result = await deleteTestCase(resolvedParams.id);

    if (!result) {
      return new Response(JSON.stringify({ error: "Test case not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({ message: "Test case deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting test case:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete test case" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
