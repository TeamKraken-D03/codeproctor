import { NextRequest } from "next/server";
import sql from "@/lib/db";
import { createSection, deleteSection, editSection } from "@/repository/section.repository";

export async function GET(req: NextRequest){
    try {
        const { searchParams } = new URL(req.url);
        
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "section_name";
        const sortOrder = searchParams.get("sortOrder") || "asc";

        const offset = (page - 1) * pageSize;
        
        // Validate sortBy to prevent SQL injection
        const allowedSortColumns = ["section_name", "semester_name", "department_name", "is_active"];
        const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "section_name";
        const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

        let sections, totalResult;

        if (search) {
            // Search with pagination and sorting
            const searchPattern = `%${search}%`;
            
            sections = await sql`
                SELECT DISTINCT sections.name as section_name, semesters.name as semester_name, 
                       departments.name as department_name, sections.isactive as is_active 
                FROM sections
                INNER JOIN semesters ON sections.semesterid = semesters.id
                INNER JOIN departments ON sections.departmentid = departments.id
                WHERE sections.name ILIKE ${searchPattern} 
                   OR semesters.name ILIKE ${searchPattern} 
                   OR departments.name ILIKE ${searchPattern}
                ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
                LIMIT ${pageSize} OFFSET ${offset}
            `;

            // Get total count for search
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
            // No search, just pagination and sorting
            sections = await sql`
                SELECT DISTINCT sections.name as section_name, semesters.name as semester_name, 
                       departments.name as department_name, sections.isactive as is_active 
                FROM sections
                INNER JOIN semesters ON sections.semesterid = semesters.id
                INNER JOIN departments ON sections.departmentid = departments.id
                ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
                LIMIT ${pageSize} OFFSET ${offset}
            `;

            // Get total count
            totalResult = await sql`
                SELECT COUNT(DISTINCT sections.id) as count 
                FROM sections
                INNER JOIN semesters ON sections.semesterid = semesters.id
                INNER JOIN departments ON sections.departmentid = departments.id
            `;
        }

        const total = parseInt(totalResult[0].count);

        return new Response(JSON.stringify({
            data: sections,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }), {status: 200});

    } catch(error) {
        console.error("Error fetching sections:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch sections" }), {status: 500});
    }
}

export async function POST(req: Request){
    try{
        const newSection = await req.json();
        const result = await createSection(newSection);
        if(result){
            return new Response(JSON.stringify({status: "success"}), {status: 201});
        } else {
            return new Response(JSON.stringify({status: "error"}), {status: 500});
        }
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify(e), {status: 500});
    }
}

export async function PUT(req: Request){
    try{
        const updatedSection = await req.json();
        const result = await editSection(updatedSection);
        if(result){
            return new Response(JSON.stringify({status: "success"}), {status: 200});
        } else {
            return new Response(JSON.stringify({status: "error"}), {status: 500});
        }
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify(e), {status: 500});
    }
}

export async function DELETE(req: Request){
    try{
        const { id } = await req.json();
        const result = await deleteSection(id);
        if(result){
            return new Response(JSON.stringify({status: "success"}), {status: 200});
        } else {
            return new Response(JSON.stringify({status: "error"}), {status: 500});
        }
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify(e), {status: 500});
    }
}