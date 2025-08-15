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

export async function editSemester(body: semester){
    try{
        await 
        sql`UPDATE semesters
        SET name=${body.name}, year=${body.year}
        WHERE id=${body.id}`

        return {success: true, message: `Successfully updated semester ${body.id}`}
    }
    catch(e){
        console.log(e);
        return {success: false, message: `Update semester ${body.id} failed`};
    }
}

export async function createSemester(body: semester){
    try{
        const res = await 
        sql`INSERT INTO semesters VALUES(${body.name}, ${body.year})`;

        return {success: true, message: `Added new semester ${res[0].id} ${res[0].name}`}
    }
    catch(e){
        return {success: false, message: `Add new semester failed`}
    }
}

export async function deleteSemester(id: string){
    try{
        await 
        sql`DELETE semesters WHERE id=${id}`;

        return {success: true, message: `Deleted semester ${id}`};
    }
    catch(e){
        console.log(e);
        return {success: false, message: `Delete semester ${id} failed`};
    }
}