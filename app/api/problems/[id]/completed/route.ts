import { CheckProblemCompletedUser, MarkProblemCompletedUser } from "@/repository/problem.repository";
import { requireAuth } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function POST(request: Request, {params}: {params: Promise<{id: string}>}){
    const user = await requireAuth();
    const req = await request.json();
    const isCompleted = req.isCompleted;

    if (user instanceof NextResponse) {
        return user;
    }
    
    console.log("Authenticated user:", user);
    const {id} = await params;
    console.log("Problem ID:", id);

    await MarkProblemCompletedUser(user.id, id, isCompleted);
    return NextResponse.json({ message: "Problem marked as completed" });
}   


export async function GET(request: Request, {params}: {params: Promise<{id: string}>}){
    const user = await requireAuth();
    if (user instanceof NextResponse) {
        return user;
    }

    const {id} = await params;
    const isCompleted = await CheckProblemCompletedUser(user.id, id);
    return NextResponse.json({ isCompleted });
}