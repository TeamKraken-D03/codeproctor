"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProblemPage() {
  const [problem, setProblem] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    async function fetchProblem() {
      const response = await fetch(`/api/problems/${id}`);
      const data = await response.json();
      setProblem(data);
    }
    fetchProblem();
  }, [id]);

  return (
    <div>
      <h1>Edit Problem</h1>
      {/* Form for editing the problem will go here */}
      {problem && <pre>{JSON.stringify(problem, null, 2)}</pre>}
    </div>
  );
}
