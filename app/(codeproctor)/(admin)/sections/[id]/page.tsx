"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { user } from "@/types/types";

const fetchAssignedUsers = async (sectionId: string) => {
	const res = await fetch(`/api/sections/${sectionId}/users`);
	return res.json();
};

const fetchUnassignedUsers = async (sectionId: string) => {
	const res = await fetch(`/api/sections/${sectionId}/users?unassigned=true`);
	return res.json();
};

const assignUserToSection = async (sectionId: string, userId: string) => {
	await fetch(`/api/sections/${sectionId}/users`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId }),
	});
};

export default function SectionUsersPage() {
	const params = useParams();
	const sectionId = params?.id as string;
	const [assignedUsers, setAssignedUsers] = useState([]);
	const [unassignedUsers, setUnassignedUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!sectionId) return;
		setLoading(true);
		Promise.all([
			fetchAssignedUsers(sectionId),
			fetchUnassignedUsers(sectionId),
		]).then(([assigned, unassigned]) => {
			setAssignedUsers(assigned.data);
			setUnassignedUsers(unassigned.data);
			setLoading(false);
		});
	}, [sectionId]);

	const handleAssign = async (userId: string) => {
		if (!sectionId) return;
		setLoading(true);
		await assignUserToSection(sectionId, userId);
		// Refresh lists
		const [assigned, unassigned] = await Promise.all([
			fetchAssignedUsers(sectionId),
			fetchUnassignedUsers(sectionId),
		]);
		setAssignedUsers(assigned.data);
		setUnassignedUsers(unassigned.data);
		setLoading(false);
	};

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Assigned Users Table */}
				<div>
					<h2 className="text-xl font-bold mb-4">Users Assigned to Section</h2>
					<table className="w-full border">
						<thead>
							<tr>
								<th className="border px-2 py-1">User ID</th>
								<th className="border px-2 py-1">Name</th>
							</tr>
						</thead>
						<tbody>
							{assignedUsers.map((user: {id: string, name: string}) => (
								<tr key={user.id}>
									<td className="border px-2 py-1">{user.id}</td>
									<td className="border px-2 py-1">{user.name}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Unassigned Users Table */}
				<div>
					<h2 className="text-xl font-bold mb-4">Users Not Assigned to Section</h2>
					<table className="w-full border">
						<thead>
							<tr>
								<th className="border px-2 py-1">User ID</th>
								<th className="border px-2 py-1">Name</th>
								<th className="border px-2 py-1">Action</th>
							</tr>
						</thead>
						<tbody>
							{unassignedUsers.map((user: user) => (
								<tr key={user.id}>
									<td className="border px-2 py-1">{user.id}</td>
									<td className="border px-2 py-1">{user.name}</td>
									<td className="border px-2 py-1">
										<Button onClick={() => handleAssign(user.id)} disabled={loading}>
											Assign
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
