import sql from "@/lib/db";
import { section } from "@/types/types";

export async function createSection(newSection: section){
    try{
        await sql`INSERT INTO sections
        VALUES(${newSection.name}, ${newSection.userid}, ${newSection.semesterid}, ${newSection.departmentid}, ${newSection.isactive})`
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

export async function editSection(newSection: section){
    try{
        await sql`UPDATE sections
        SET name = ${newSection.name}, userid = ${newSection.userid}, semesterid = ${newSection.semesterid}, departmentid = ${newSection.departmentid}, isactive = ${newSection.isactive}
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