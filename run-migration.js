import sql from "./lib/db.js";

async function runMigration() {
  try {
    console.log("Creating course table...");
    
    // Create course table
    await sql`
      CREATE TABLE IF NOT EXISTS course (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          departmentid UUID REFERENCES departments(id) ON DELETE CASCADE,
          semesterid UUID REFERENCES semesters(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log("Creating problem_associations table...");
    
    // Create problem_associations table
    await sql`
      CREATE TABLE IF NOT EXISTS problem_associations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          problemid UUID REFERENCES problems(id) ON DELETE CASCADE,
          departmentid UUID REFERENCES departments(id) ON DELETE CASCADE,
          semesterid UUID REFERENCES semesters(id) ON DELETE CASCADE,
          courseid UUID REFERENCES course(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log("Creating indexes...");
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_associations_problemid ON problem_associations(problemid)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_associations_departmentid ON problem_associations(departmentid)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_associations_semesterid ON problem_associations(semesterid)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_associations_courseid ON problem_associations(courseid)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_departmentid ON course(departmentid)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_semesterid ON course(semesterid)`;
    
    console.log("Migration completed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
