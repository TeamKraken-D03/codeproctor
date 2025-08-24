import sql from "@/lib/db";
import { semester } from "@/types/types";

export async function getAllSemesters(){
    try{
        const data = await sql`select id,name,year from semesters`;

        return {status: true, data: data};
    }
    catch(e){
        console.log(e);
        return {status: false, error: e};
    }
}

export async function getSemestersWithPagination(
  page: number,
  pageSize: number,
  search: string,
  sortBy: string,
  sortOrder: string
) {
  try {
    const offset = (page - 1) * pageSize;
    
    const allowedSortColumns = ["id", "name", "year"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let semesters, totalResult;

    if (search) {
      const searchPattern = `%${search}%`;
      
      semesters = await sql`
        SELECT id, name, year FROM semesters
        WHERE name ILIKE ${searchPattern} OR year::text ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`
        SELECT COUNT(*) as count FROM semesters
        WHERE name ILIKE ${searchPattern} OR year::text ILIKE ${searchPattern}
      `;
    } else {
      semesters = await sql`
        SELECT id, name, year FROM semesters
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`SELECT COUNT(*) as count FROM semesters`;
    }

    const total = parseInt(totalResult[0].count);

    return {
      data: semesters,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error getting paginated semesters:", error);
    throw error;
  }
}

export async function editSemester(body: semester){
    try{
        await sql`UPDATE semesters
        SET name=${body.name}, year=${body.year}
        WHERE id=${body.id}`

        return {success: true, message: `Successfully updated semester ${body.id}`}
    }
    catch(e){
        console.log(e);
        return {success: false, message: `Update semester ${body.id} failed`};
    }
}

export async function createSemester(body: { name: string; year: string }){
    try{
        const res = await sql`INSERT INTO semesters (name, year) VALUES (${body.name}, ${body.year}) RETURNING id, name, year`;

        return {success: true, message: `Added new semester ${res[0].id} ${res[0].name}`}
    }
    catch(e){
        console.log(e);
        return {success: false, message: `Add new semester failed`}
    }
}

export async function deleteSemester(id: string){
    try{
        await sql`DELETE FROM semesters WHERE id=${id}`;

        return {success: true, message: `Deleted semester ${id}`};
    }
    catch(e){
        console.log(e);
        return {success: false, message: `Delete semester ${id} failed`};
    }
}