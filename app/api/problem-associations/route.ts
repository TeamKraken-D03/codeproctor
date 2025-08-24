import { NextRequest, NextResponse } from "next/server";
import { createProblemAssociations, getProblemsWithAssociations } from "@/repository/problem-associations.repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");
    const semesterId = searchParams.get("semesterId");
    const courseId = searchParams.get("courseId");

    const problems = await getProblemsWithAssociations(
      departmentId || undefined,
      semesterId || undefined,
      courseId || undefined
    );

    return NextResponse.json(problems);
  } catch (error) {
    console.error("Error fetching problems with associations:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { associations } = body;

    if (!associations || !Array.isArray(associations)) {
      return NextResponse.json(
        { error: "Associations array is required" },
        { status: 400 }
      );
    }

    const results = await createProblemAssociations(associations);
    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Error creating problem associations:", error);
    return NextResponse.json(
      { error: "Failed to create problem associations" },
      { status: 500 }
    );
  }
}
