import sql from "@/lib/db";

export interface Course {
  id: string;
  name: string;
  departmentid: string;
  semesterid: string;
  created_at: Date;
}

export interface CreateCourse {
  name: string;
  departmentId: string;
  semesterId: string;
}

// Create a new course
export async function createCourse(courseData: CreateCourse) {
  try {
    const result = await sql`
      INSERT INTO course (name, departmentid, semesterid)
      VALUES (${courseData.name}, ${courseData.departmentId}, ${courseData.semesterId})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

// Get all courses
export async function getAllCourses() {
  try {
    const courses = await sql`
      SELECT c.*, d.name as department_name, s.name as semester_name
      FROM course c
      LEFT JOIN departments d ON c.departmentid = d.id
      LEFT JOIN semesters s ON c.semesterid = s.id
      ORDER BY c.name ASC
    `;
    return courses;
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
}

// Get courses by department and semester
export async function getCoursesByDepartmentAndSemester(departmentId: string, semesterId: string) {
  try {
    const courses = await sql`
      SELECT * FROM course
      WHERE departmentid = ${departmentId} AND semesterid = ${semesterId}
      ORDER BY name ASC
    `;
    return courses;
  } catch (error) {
    console.error("Error getting courses by department and semester:", error);
    throw error;
  }
}

// Get course by ID
export async function getCourseById(id: string) {
  try {
    const course = await sql`
      SELECT c.*, d.name as department_name, s.name as semester_name
      FROM course c
      LEFT JOIN departments d ON c.departmentid = d.id
      LEFT JOIN semesters s ON c.semesterid = s.id
      WHERE c.id = ${id}
    `;
    return course[0];
  } catch (error) {
    console.error("Error getting course by ID:", error);
    throw error;
  }
}

// Update a course
export async function updateCourse(id: string, courseData: CreateCourse) {
  try {
    const result = await sql`
      UPDATE course
      SET name = ${courseData.name}, departmentid = ${courseData.departmentId}, semesterid = ${courseData.semesterId}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}

// Delete a course
export async function deleteCourse(id: string) {
  try {
    await sql`DELETE FROM course WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}
