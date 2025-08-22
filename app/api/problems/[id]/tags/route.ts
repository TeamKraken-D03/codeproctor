import { addTagToProblem } from "@/repository/tag.repository";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { tagId } = await req.json();

    if (!tagId) {
      return new Response(JSON.stringify({ error: "tagId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const res = await addTagToProblem(params.id, tagId);
    return new Response(
      JSON.stringify({
        message: "Tag added to problem successfully",
        result: res,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding tag to problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add tag to problem" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
