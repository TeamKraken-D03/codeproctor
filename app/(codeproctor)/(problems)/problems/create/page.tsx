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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface Tag {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Semester {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  departmentid: string;
  semesterid: string;
}

export interface CreateTestcase {
  name: string;
  input: string;
  output: string;
}

export interface TestcaseDTO {
  input: string;
  output: string;
}

export interface CreateProblem {
  problemid: string;
  title: string;
  description: string;
  created_by?: string; // Optional here as it will be set in the API
}

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problemid, setProblemid] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [testcaseName, setTestcaseName] = useState("");
  const [testcaseInput, setTestcaseInput] = useState("");
  const [testcaseOutput, setTestcaseOutput] = useState("");
  const [createdProblem, setCreatedProblem] = useState(false);
  const [testcases, setTestCases] = useState<TestcaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTestcase, setIsCreatingTestcase] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Tag creation states
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  // Department/Semester/Course states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Course creation states
  const [newCourseName, setNewCourseName] = useState("");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);

  const {data: session} = useSession();

  const router = useRouter();

  useEffect(() => {
    fetchTags();
    fetchDepartments();
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (problemid) {
      getTestCases();
    }
  }, [problemid]);

  // Fetch courses when department and semester are selected
  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      fetchCourses();
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
  }, [selectedDepartment, selectedSemester]);

  async function fetchTags() {
    try {
      const res = await fetch("/api/problems/tags");
      if (res.ok) {
        const data = await res.json();
        setTags(Array.isArray(data) ? data : []);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setTags([]);
    }
  }

  async function fetchDepartments() {
    try {
      const res = await fetch("/api/departments/all");
      if (res.ok) {
        const response = await res.json();
        // Handle the response structure from department repository
        if (response.status && response.data) {
          setDepartments(response.data);
        } else {
          setDepartments([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments([]);
    }
  }

  async function fetchSemesters() {
    try {
      const res = await fetch("/api/semesters/all");
      if (res.ok) {
        const response = await res.json();
        // Handle the response structure from semester repository
        if (response.status && response.data) {
          setSemesters(response.data);
        } else {
          setSemesters([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
      setSemesters([]);
    }
  }

  async function fetchCourses() {
    if (!selectedDepartment || !selectedSemester) return;
    
    try {
      const res = await fetch(`/api/courses?departmentId=${selectedDepartment}&semesterId=${selectedSemester}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    }
  }

  async function createNewTag() {
    if (!newTagName.trim()) return;
    
    setIsCreatingTag(true);
    try {
      const res = await fetch("/api/problems/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() })
      });

      if (res.ok) {
        const newTag = await res.json();
        setTags(prev => [...prev, newTag]);
        setSelectedTag(newTag.id);
        setNewTagName("");
        setIsTagDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
    } finally {
      setIsCreatingTag(false);
    }
  }

  async function createNewCourse() {
    if (!newCourseName.trim() || !selectedDepartment || !selectedSemester) return;
    
    setIsCreatingCourse(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCourseName.trim(),
          departmentId: selectedDepartment,
          semesterId: selectedSemester
        })
      });

      if (res.ok) {
        const newCourse = await res.json();
        setCourses(prev => [...prev, newCourse]);
        setSelectedCourse(newCourse.id);
        setNewCourseName("");
        setIsCourseDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setIsCreatingCourse(false);
    }
  }

  async function getTestCases() {
    if (!problemid) return;

    try {
      const res = await fetch(`/api/problems/${problemid}/testcases`);
      if (res.ok) {
        const data = await res.json();
        setTestCases(data);
      }
    } catch (error) {
      console.error("Failed to fetch test cases:", error);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setSelectedTag("");
    setProblemid("");
    setCreatedProblem(false);
    setTestCases([]);
    setSelectedDepartment("");
    setSelectedSemester("");
    setSelectedCourse("");
    setCourses([]);
  }

  function resetTestcaseForm() {
    setTestcaseName("");
    setTestcaseInput("");
    setTestcaseOutput("");
  }

  async function handleCreateProblem() {
    if (!title.trim()) {
      alert("Please enter a problem title");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a problem description");
      return;
    }

    setIsLoading(true);

    try {
      const newProblemId = crypto.randomUUID();

      const newProblem: CreateProblem = {
        problemid: newProblemId,
        title: title.trim(),
        description: description.trim(),
        // created_by will be populated from the session in the API
        created_by: session?.user.id || undefined,
      };

      const problemRes = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProblem),
      });

      if (!problemRes.ok) {
        const errorData = await problemRes.json();
        throw new Error(
          errorData.error ||
            `Failed to create problem: ${problemRes.statusText}`
        );
      }

      setProblemid(newProblemId);
      setCreatedProblem(true);

      // Assign tag if selected
      if (selectedTag) {
        await assignTagToProblem(newProblemId);
      }

      // Create problem associations if department/semester/course are selected
      if (selectedDepartment || selectedSemester || selectedCourse) {
        await createProblemAssociations(newProblemId);
      }

      alert("Problem created successfully!");
    } catch (error) {
      console.error("Error creating problem:", error);
      alert(
        `Failed to create problem: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function createProblemAssociations(problemId: string) {
    try {
      const associations = [{
        problemId,
        departmentId: selectedDepartment || undefined,
        semesterId: selectedSemester || undefined,
        courseId: selectedCourse || undefined
      }];

      const res = await fetch("/api/problem-associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ associations })
      });

      if (!res.ok) {
        throw new Error("Failed to create problem associations");
      }
    } catch (error) {
      console.error("Error creating problem associations:", error);
      // Don't throw here as the problem was already created successfully
    }
  }

  async function assignTagToProblem(problemId: string) {
    try {
      const res = await fetch(`/api/problems/${problemId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId: selectedTag }),
      });

      if (!res.ok) {
        throw new Error(`Failed to assign tag: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error assigning tag:", error);
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

      const res = await fetch(`/api/problems/${problemid}/testcases`, {
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
      getTestCases();
    } catch (error) {
      console.error("Error creating test case:", error);
      alert("Failed to create test case");
    } finally {
      setIsCreatingTestcase(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Create Problem
        </h1>
        <p className="text-muted-foreground">
          Create a new coding problem for students to solve
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
            <CardDescription>
              Fill in the basic information for your problem
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
                disabled={createdProblem || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createdProblem || isLoading}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag (Optional)</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedTag}
                  onValueChange={setSelectedTag}
                  disabled={createdProblem || isLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.isArray(tags) && tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={createdProblem || isLoading}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Tag</DialogTitle>
                      <DialogDescription>
                        Add a new tag that can be used for categorizing problems.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tagName">Tag Name</Label>
                        <Input
                          id="tagName"
                          placeholder="Enter tag name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={createNewTag} 
                          disabled={isCreatingTag || !newTagName.trim()}
                          className="flex-1"
                        >
                          {isCreatingTag ? "Creating..." : "Create Tag"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsTagDialogOpen(false);
                            setNewTagName("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Department Selection */}
            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                disabled={createdProblem || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.isArray(departments) && departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Semester Selection */}
            {selectedDepartment && (
              <div className="space-y-2">
                <Label htmlFor="semester">Semester (Optional)</Label>
                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                  disabled={createdProblem || isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.isArray(semesters) && semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Course Selection */}
            {selectedDepartment && selectedSemester && (
              <div className="space-y-2">
                <Label htmlFor="course">Course (Optional)</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                    disabled={createdProblem || isLoading}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.isArray(courses) && courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" disabled={createdProblem || isLoading}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                        <DialogDescription>
                          Add a new course for the selected department and semester.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="courseName">Course Name</Label>
                          <Input
                            id="courseName"
                            placeholder="Enter course name"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={createNewCourse} 
                            disabled={isCreatingCourse || !newCourseName.trim()}
                            className="flex-1"
                          >
                            {isCreatingCourse ? "Creating..." : "Create Course"}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsCourseDialogOpen(false);
                              setNewCourseName("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateProblem}
                disabled={createdProblem || isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create Problem"}
              </Button>
              {createdProblem && (
                <Button onClick={resetForm} variant="outline">
                  Create New
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
            <CardDescription>
              {createdProblem
                ? "Add test cases to validate solutions"
                : "Create a problem first to add test cases"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!createdProblem ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Please create a problem first</p>
              </div>
            ) : (
              <>
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
                        {isCreatingTestcase
                          ? "Creating..."
                          : "Create Test Case"}
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
                      <Card key={index} className="border-border/50">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              Test Case {index + 1}
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
