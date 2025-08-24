import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting migration...");

    // Drop existing tables if they exist
    await sql`DROP TABLE IF EXISTS problem_associations CASCADE`;
    await sql`DROP TABLE IF EXISTS course CASCADE`;

    // Create course table
    await sql`
      CREATE TABLE course (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          departmentid UUID REFERENCES departments(id) ON DELETE CASCADE,
          semesterid UUID REFERENCES semesters(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create problem_associations table
    await sql`
      CREATE TABLE problem_associations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          problemid UUID REFERENCES problems(id) ON DELETE CASCADE,
          departmentid UUID REFERENCES departments(id) ON DELETE CASCADE,
          semesterid UUID REFERENCES semesters(id) ON DELETE CASCADE,
          courseid UUID REFERENCES course(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX idx_problem_associations_problemid ON problem_associations(problemid)`;
    await sql`CREATE INDEX idx_problem_associations_departmentid ON problem_associations(departmentid)`;
    await sql`CREATE INDEX idx_problem_associations_semesterid ON problem_associations(semesterid)`;
    await sql`CREATE INDEX idx_problem_associations_courseid ON problem_associations(courseid)`;
    await sql`CREATE INDEX idx_course_departmentid ON course(departmentid)`;
    await sql`CREATE INDEX idx_course_semesterid ON course(semesterid)`;

    console.log("Migration completed successfully!");

    return NextResponse.json({ 
      success: true, 
      message: "Migration completed successfully!" 
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { 
        error: "Migration failed", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
