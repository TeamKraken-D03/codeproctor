import { NextRequest } from 'next/server';
import { getAssignedUsers, getUnassignedUsers, assignUserToSection } from '@/repository/section.repository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sectionId = await params.id;
  const searchParams = request.nextUrl.searchParams;
  
  const type = searchParams.get('unassigned'); 
  
  try {
    if (type === 'true') {
      const unassignedUsers = await getUnassignedUsers(sectionId);
      return Response.json(unassignedUsers);
    } else {
      const assignedUsers = await getAssignedUsers(sectionId);
      return Response.json(assignedUsers);
    }
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sectionId = await params.id;
  const { userId } = await request.json();
  
  try {
    const result = await assignUserToSection(sectionId, userId);
    
    if (result.status) {
      return Response.json({ success: true, message: 'User assigned successfully' });
    } else {
      return Response.json({ error: 'Failed to assign user', details: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error assigning user:', error);
    return Response.json({ error: 'Failed to assign user' }, { status: 500 });
  }
}