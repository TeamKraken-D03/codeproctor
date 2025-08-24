// Get users assigned to a section
export async function getAssignedUsers(sectionid: string) {
  try {
    const users = await sql`
      SELECT u.* FROM users u
      INNER JOIN sections_users su ON u.id = su.userid
      WHERE su.sectionid = ${sectionid}
    `;
    return { status: true, data: users };
  } catch (e) {
    console.log(e);
    return { status: false, error: e };
  }
}

// Get users not assigned to a section
export async function getUnassignedUsers(sectionid: string) {
  try {
    const users = await sql`
      SELECT u.* FROM users u
      WHERE u.id NOT IN (
        SELECT su.userid FROM sections_users su WHERE su.sectionid = ${sectionid}
      )
    `;
    return { status: true, data: users };
  } catch (e) {
    console.log(e);
    return { status: false, error: e };
  }
}

// Assign a user to a section
export async function assignUserToSection(sectionid: string, userid: string) {
  try {
    await sql`
      INSERT INTO sections_users (sectionid, userid)
      VALUES (${sectionid}, ${userid})
    `;
    return { status: true };
  } catch (e) {
    console.log(e);
    return { status: false, error: e };
  }
}
import sql from "@/lib/db";
import { section } from "@/types/types";

export interface createSectionType{
    name: string;
    semesterid: string;
    departmentid: string;
}

export async function createSection(newSection: createSectionType){
    try{
        await sql`INSERT INTO sections (name, semesterid, departmentid)
        VALUES(${newSection.name}, ${newSection.semesterid}, ${newSection.departmentid})`
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

export async function getAllSections(){
    try{
        const sections = await sql`SELECT DISTINCT sections.name as section_name, semesters.name as semester_name, departments.name as department_name, sections.isactive as is_active 
        FROM sections
        INNER JOIN semesters ON sections.semesterid = semesters.id
        INNER JOIN departments ON sections.departmentid = departments.id`;
        return {status: true, data: sections};
    }
    catch(e){
        console.log(e);
        return {status: false, error: e};
    }
}

export async function getSectionsWithPagination(
  page: number,
  pageSize: number,
  search: string,
  sortBy: string,
  sortOrder: string
) {
  try {
    const offset = (page - 1) * pageSize;
    
    const allowedSortColumns = ["section_name", "semester_name", "department_name", "is_active"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "section_name";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let sections, totalResult;

    if (search) {

      const searchPattern = `%${search}%`;
      
      sections = await sql`
        SELECT DISTINCT sections.id, sections.name as section_name, semesters.name as semester_name, 
               departments.name as department_name, sections.isactive as is_active,
               sections.semesterid, sections.departmentid
        FROM sections
        INNER JOIN semesters ON sections.semesterid = semesters.id
        INNER JOIN departments ON sections.departmentid = departments.id
        WHERE sections.name ILIKE ${searchPattern} 
           OR semesters.name ILIKE ${searchPattern} 
           OR departments.name ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`
        SELECT COUNT(DISTINCT sections.id) as count 
        FROM sections
        INNER JOIN semesters ON sections.semesterid = semesters.id
        INNER JOIN departments ON sections.departmentid = departments.id
        WHERE sections.name ILIKE ${searchPattern} 
           OR semesters.name ILIKE ${searchPattern} 
           OR departments.name ILIKE ${searchPattern}
      `;
    } else {

      sections = await sql`
        SELECT DISTINCT sections.id, sections.name as section_name, semesters.name as semester_name, 
               departments.name as department_name, sections.isactive as is_active,
               sections.semesterid, sections.departmentid
        FROM sections
        INNER JOIN semesters ON sections.semesterid = semesters.id
        INNER JOIN departments ON sections.departmentid = departments.id
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`
        SELECT COUNT(DISTINCT sections.id) as count 
        FROM sections
        INNER JOIN semesters ON sections.semesterid = semesters.id
        INNER JOIN departments ON sections.departmentid = departments.id
      `;
    }

    const total = parseInt(totalResult[0].count);

    return {
      data: sections,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error getting paginated sections:", error);
    throw error;
  }
}

export async function editSection(newSection: section){
    try{
        await sql`UPDATE sections
        SET name = ${newSection.name}, semesterid = ${newSection.semesterid}, departmentid = ${newSection.departmentid}, isactive = ${newSection.isactive}
        WHERE id = ${newSection.id}`;
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

export async function deleteSection(id: string){
    try{
        await sql`DELETE FROM sections WHERE id = ${id}`;
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}