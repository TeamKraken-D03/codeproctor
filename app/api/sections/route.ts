import { createSection, deleteSection, editSection, getAllSections } from "@/repository/section.repository";

export async function GET(){
    try{
        const sections = await getAllSections();
        return new Response(JSON.stringify(sections), {status: 200});
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify(e), {status: 500});
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