import { NextResponse, NextRequest } from "next/server";
import {
  getDepartmentsWithPagination,
  createDepartment,
  editDepartment,
  deleteDepartment,
} from "@/repository/department.repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const result = await getDepartmentsWithPagination(page, pageSize, search, sortBy, sortOrder);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createDepartment(body);

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const result = await editDepartment(body);

    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteDepartment(id);

    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
