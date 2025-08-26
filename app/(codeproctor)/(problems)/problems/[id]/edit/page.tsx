"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface Tag {
  id: string;
  name: string;
}

export interface CreateTestcase {
  name: string;
  input: string;
  output: string;
}

export interface TestcaseDTO {
  id: string;
  input: string;
  output: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  created_by?: string;
}

export default function EditProblemPage() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [problemTags, setProblemTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("no-tag");
  const [testcaseName, setTestcaseName] = useState("");
  const [testcaseInput, setTestcaseInput] = useState("");
  const [testcaseOutput, setTestcaseOutput] = useState("");
  const [testcases, setTestCases] = useState<TestcaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTestcase, setIsCreatingTestcase] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { id } = useParams();
  const router = useRouter();

  const fetchProblem = useCallback(
    async function () {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/problems/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProblem(data);
          setTitle(data.title);
          setDescription(data.description);
        } else {
          console.error("Failed to fetch problem");
          router.push("/problems");
        }
      } catch (error) {
        console.error("Failed to fetch problem:", error);
        router.push("/problems");
      } finally {
        setIsLoading(false);
      }
    },
    [id, router]
  );

  const fetchTags = useCallback(async function () {
    try {
      const res = await fetch("/api/problems/tags");
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }, []);

  const fetchProblemTags = useCallback(
    async function () {
      try {
        const res = await fetch(`/api/problems/${id}/tags`);
        if (res.ok) {
          const data = await res.json();
          setProblemTags(data);
          if (data.length > 0) {
            setSelectedTag(data[0].id);
          } else {
            setSelectedTag("no-tag");
          }
        }
      } catch (error) {
        console.error("Failed to fetch problem tags:", error);
      }
    },
    [id]
  );

  const fetchTestCases = useCallback(
    async function () {
      try {
        console.log("Fetching test cases for problem:", id);
        const res = await fetch(`/api/problems/${id}/testcases`);
        if (res.ok) {
          const data = await res.json();
          console.log("Test cases fetched:", data);
          setTestCases(data);
        } else {
          console.error("Failed to fetch test cases. Status:", res.status);
          const errorText = await res.text();
          console.error("Error response:", errorText);
        }
      } catch (error) {
        console.error("Failed to fetch test cases:", error);
      }
    },
    [id]
  );

  function resetTestcaseForm() {
    setTestcaseName("");
    setTestcaseInput("");
    setTestcaseOutput("");
  }

  async function handleUpdateProblem() {
    if (!title.trim()) {
      alert("Please enter a problem title");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a problem description");
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        title: title.trim(),
        description: description.trim(),
      };

      const problemRes = await fetch(`/api/problems/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!problemRes.ok) {
        const errorData = await problemRes.json();
        throw new Error(
          errorData.error ||
            `Failed to update problem: ${problemRes.statusText}`
        );
      }

      const currentTagId =
        problemTags.length > 0 ? problemTags[0].id : "no-tag";
      if (selectedTag !== currentTagId) {
        await updateProblemTag(
          currentTagId === "no-tag" ? null : currentTagId,
          selectedTag === "no-tag" ? "" : selectedTag
        );
      }

      alert("Problem updated successfully!");
      await fetchProblem();
      await fetchProblemTags();
    } catch (error) {
      console.error("Error updating problem:", error);
      alert(
        `Failed to update problem: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function updateProblemTag(oldTagId: string | null, newTagId: string) {
    try {
      if (!newTagId) {
        if (oldTagId) {
          await fetch(`/api/problems/${id}/tags`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tagId: oldTagId }),
          });
        }
        return;
      }

      const res = await fetch(`/api/problems/${id}/tags`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldTagId, newTagId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update tag: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  }

  async function handleCreateTestcase() {
    if (
      !testcaseName.trim() ||
      !testcaseInput.trim() ||
      !testcaseOutput.trim()
    ) {
      alert("Please fill in all testcase fields");
      return;
    }

    setIsCreatingTestcase(true);

    try {
      const newTestCase: CreateTestcase = {
        name: testcaseName.trim(),
        input: testcaseInput.trim(),
        output: testcaseOutput.trim(),
      };

      const res = await fetch(`/api/problems/${id}/testcases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTestCase),
      });

      if (!res.ok) {
        throw new Error("Failed to create test case");
      }

      alert("Test case created successfully!");
      setIsDialogOpen(false);
      resetTestcaseForm();
      fetchTestCases();
    } catch (error) {
      console.error("Error creating test case:", error);
      alert("Failed to create test case");
    } finally {
      setIsCreatingTestcase(false);
    }
  }

  async function handleDeleteTestcase(testcaseId: string) {
    if (!confirm("Are you sure you want to delete this test case?")) {
      return;
    }

    try {
      const res = await fetch(`/api/testcases/${testcaseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete test case");
      }

      alert("Test case deleted successfully!");
      fetchTestCases();
    } catch (error) {
      console.error("Error deleting test case:", error);
      alert("Failed to delete test case");
    }
  }

  useEffect(() => {
    if (id) {
      fetchProblem();
      fetchTags();
      fetchProblemTags();
      fetchTestCases();
    }
  }, [id, fetchProblem, fetchTags, fetchProblemTags, fetchTestCases]);

  useEffect(() => {
    console.log("Test cases state updated:", testcases);
  }, [testcases]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg">Loading problem...</div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Problem not found</div>
          <Button onClick={() => router.push("/problems")} className="mt-4">
            Go back to problems
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Edit Problem
        </h1>
        <p className="text-muted-foreground">
          Update the problem details, tags, and test cases
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
            <CardDescription>
              Update the basic information for your problem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                placeholder="Enter problem title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUpdating}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag (Optional)</Label>
              <Select
                value={selectedTag}
                onValueChange={setSelectedTag}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="no-tag">No tag</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpdateProblem}
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? "Updating..." : "Update Problem"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
            <CardDescription>
              Manage test cases to validate solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test Case
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Test Case</DialogTitle>
                  <DialogDescription>
                    Add input and expected output for this test case
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="testcase-name">Test Case Name</Label>
                    <Input
                      id="testcase-name"
                      placeholder="e.g., Test Case 1"
                      value={testcaseName}
                      onChange={(e) => setTestcaseName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testcase-input">Input</Label>
                    <Textarea
                      id="testcase-input"
                      placeholder="Enter the input for this test case"
                      value={testcaseInput}
                      onChange={(e) => setTestcaseInput(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testcase-output">Expected Output</Label>
                    <Textarea
                      id="testcase-output"
                      placeholder="Enter the expected output"
                      value={testcaseOutput}
                      onChange={(e) => setTestcaseOutput(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button
                    onClick={handleCreateTestcase}
                    disabled={isCreatingTestcase}
                    className="w-full"
                  >
                    {isCreatingTestcase ? "Creating..." : "Create Test Case"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {testcases.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No test cases added yet</p>
                </div>
              ) : (
                testcases.map((tc, index) => (
                  <Card key={tc.id} className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">
                            Test Case {index + 1}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTestcase(tc.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            Input:
                          </div>
                          <div className="text-sm bg-muted p-2 rounded font-mono">
                            {tc.input}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            Output:
                          </div>
                          <div className="text-sm bg-muted p-2 rounded font-mono">
                            {tc.output}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
