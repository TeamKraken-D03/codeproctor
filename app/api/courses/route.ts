import { NextRequest, NextResponse } from "next/server";
import { createCourse, getCoursesByDepartmentAndSemester } from "@/repository/course.repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");
    const semesterId = searchParams.get("semesterId");

    if (departmentId && semesterId) {
      const courses = await getCoursesByDepartmentAndSemester(departmentId, semesterId);
      return NextResponse.json(courses);
    }

    return NextResponse.json({ error: "Department ID and Semester ID are required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, departmentId, semesterId } = body;

    if (!name || !departmentId || !semesterId) {
      return NextResponse.json(
        { error: "Name, departmentId, and semesterId are required" },
        { status: 400 }
      );
    }

    const course = await createCourse({
      name,
      departmentId,
      semesterId
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
