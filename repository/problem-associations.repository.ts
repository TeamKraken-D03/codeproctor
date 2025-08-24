import sql from "@/lib/db";

export interface ProblemAssociation {
  problemId: string;
  departmentId?: string;
  semesterId?: string;
  courseId?: string;
}



// Create associations between problem and department/semester/course
export async function createProblemAssociations(associations: ProblemAssociation[]) {
  try {
    const results = [];
    
    for (const assoc of associations) {
      const result = await sql`
        INSERT INTO problem_associations (problemid, departmentid, semesterid, courseid)
        VALUES (${assoc.problemId}, ${assoc.departmentId || null}, ${assoc.semesterId || null}, ${assoc.courseId || null})
        RETURNING *
      `;
      results.push(result[0]);
    }
    
    return results;
  } catch (error) {
    console.error("Error creating problem associations:", error);
    throw error;
  }
}

// Get problems by department/semester/course filters
export async function getProblemsWithAssociations(
  departmentId?: string,
  semesterId?: string,
  courseId?: string
) {
  try {
    if (departmentId || semesterId || courseId) {
      // Query for problems with specific associations
      if (departmentId && semesterId && courseId) {
        // All three filters
        const problems = await sql`
          SELECT DISTINCT p.*, u.name as creator_name,
                 d.name as department_name, s.name as semester_name, c.name as course_name
          FROM problems p
          LEFT JOIN users u ON p.created_by = u.id
          INNER JOIN problem_associations pa ON p.id = pa.problemid
          LEFT JOIN departments d ON pa.departmentid = d.id
          LEFT JOIN semesters s ON pa.semesterid = s.id
          LEFT JOIN course c ON pa.courseid = c.id
          WHERE pa.departmentid = ${departmentId} AND pa.semesterid = ${semesterId} AND pa.courseid = ${courseId}
          ORDER BY p.created_at DESC
        `;
        return problems;
      } else if (departmentId && semesterId) {
        // Department and semester
        const problems = await sql`
          SELECT DISTINCT p.*, u.name as creator_name,
                 d.name as department_name, s.name as semester_name, c.name as course_name
          FROM problems p
          LEFT JOIN users u ON p.created_by = u.id
          INNER JOIN problem_associations pa ON p.id = pa.problemid
          LEFT JOIN departments d ON pa.departmentid = d.id
          LEFT JOIN semesters s ON pa.semesterid = s.id
          LEFT JOIN course c ON pa.courseid = c.id
          WHERE pa.departmentid = ${departmentId} AND pa.semesterid = ${semesterId}
          ORDER BY p.created_at DESC
        `;
        return problems;
      } else if (departmentId) {
        // Department only
        const problems = await sql`
          SELECT DISTINCT p.*, u.name as creator_name,
                 d.name as department_name, s.name as semester_name, c.name as course_name
          FROM problems p
          LEFT JOIN users u ON p.created_by = u.id
          INNER JOIN problem_associations pa ON p.id = pa.problemid
          LEFT JOIN departments d ON pa.departmentid = d.id
          LEFT JOIN semesters s ON pa.semesterid = s.id
          LEFT JOIN course c ON pa.courseid = c.id
          WHERE pa.departmentid = ${departmentId}
          ORDER BY p.created_at DESC
        `;
        return problems;
      } else if (semesterId) {
        // Semester only
        const problems = await sql`
          SELECT DISTINCT p.*, u.name as creator_name,
                 d.name as department_name, s.name as semester_name, c.name as course_name
          FROM problems p
          LEFT JOIN users u ON p.created_by = u.id
          INNER JOIN problem_associations pa ON p.id = pa.problemid
          LEFT JOIN departments d ON pa.departmentid = d.id
          LEFT JOIN semesters s ON pa.semesterid = s.id
          LEFT JOIN course c ON pa.courseid = c.id
          WHERE pa.semesterid = ${semesterId}
          ORDER BY p.created_at DESC
        `;
        return problems;
      } else if (courseId) {
        // Course only
        const problems = await sql`
          SELECT DISTINCT p.*, u.name as creator_name,
                 d.name as department_name, s.name as semester_name, c.name as course_name
          FROM problems p
          LEFT JOIN users u ON p.created_by = u.id
          INNER JOIN problem_associations pa ON p.id = pa.problemid
          LEFT JOIN departments d ON pa.departmentid = d.id
          LEFT JOIN semesters s ON pa.semesterid = s.id
          LEFT JOIN course c ON pa.courseid = c.id
          WHERE pa.courseid = ${courseId}
          ORDER BY p.created_at DESC
        `;
        return problems;
      }
    } else {
      // If no filters, show problems with no associations (global problems)
      const problems = await sql`
        SELECT p.*, u.name as creator_name,
               null as department_name, null as semester_name, null as course_name
        FROM problems p
        LEFT JOIN users u ON p.created_by = u.id
        LEFT JOIN problem_associations pa ON p.id = pa.problemid
        WHERE pa.problemid IS NULL
        ORDER BY p.created_at DESC
      `;
      return problems;
    }
  } catch (error) {
    console.error("Error getting problems with associations:", error);
    throw error;
  }
}

// Get associations for a specific problem
export async function getProblemAssociations(problemId: string) {
  try {
    const associations = await sql`
      SELECT pa.*, d.name as department_name, s.name as semester_name, c.name as course_name
      FROM problem_associations pa
      LEFT JOIN departments d ON pa.departmentid = d.id
      LEFT JOIN semesters s ON pa.semesterid = s.id
      LEFT JOIN course c ON pa.courseid = c.id
      WHERE pa.problemid = ${problemId}
    `;
    return associations;
  } catch (error) {
    console.error("Error getting problem associations:", error);
    throw error;
  }
}

// Delete all associations for a problem
export async function deleteProblemAssociations(problemId: string) {
  try {
    await sql`DELETE FROM problem_associations WHERE problemid = ${problemId}`;
    return true;
  } catch (error) {
    console.error("Error deleting problem associations:", error);
    throw error;
  }
}
