import {
  createSemester,
  getAllSemesters,
  editSemester,
  deleteSemester,
} from "@/repository/semester.repository";

export async function GET() {
  const semesters = await getAllSemesters();
  if (semesters.status) {
    return new Response(JSON.stringify(semesters.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(JSON.stringify({ error: semesters.error }), {
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
