import {
  addTagToProblem,
  getTagsForProblem,
  removeTagFromProblem,
} from "@/repository/tag.repository";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    params = await params;
    const tags = await getTagsForProblem(params.id);
    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching tags for problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch tags for problem" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    params = await params;
    const { tagId } = await req.json();

    if (!tagId) {
      return new Response(JSON.stringify({ error: "tagId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Await the entire params object before accessing its properties
    const params = await context.params;
    const id = params.id;
    
    const res = await addTagToProblem(id, tagId);
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    params = await params;
    const { oldTagId, newTagId } = await req.json();

    if (!newTagId) {
      return new Response(JSON.stringify({ error: "newTagId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Remove old tag if exists
    if (oldTagId) {
      await removeTagFromProblem(params.id, oldTagId);
    }

    // Add new tag
    await addTagToProblem(params.id, newTagId);

    return new Response(
      JSON.stringify({
        message: "Tag updated successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating tag for problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update tag for problem" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    params = await params;
    const { tagId } = await req.json();

    if (!tagId) {
      return new Response(JSON.stringify({ error: "tagId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    await removeTagFromProblem(params.id, tagId);

    return new Response(
      JSON.stringify({
        message: "Tag removed successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error removing tag from problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to remove tag from problem" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
