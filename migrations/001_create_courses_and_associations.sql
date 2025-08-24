-- Create course table
CREATE TABLE IF NOT EXISTS course (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    departmentid UUID REFERENCES departments(id) ON DELETE CASCADE,
    semesterid UUID REFERENCES semesters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create problem_associations table for many-to-many relationships
CREATE TABLE IF NOT EXISTS problem_associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problemid UUID REFERENCES problems(id) ON DELETE CASCADE,
    departmentid UUID REFERENCES departments(id) ON DELETE CASCADE,
    semesterid UUID REFERENCES semesters(id) ON DELETE CASCADE,
    courseid UUID REFERENCES course(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_problem_associations_problemid ON problem_associations(problemid);
CREATE INDEX IF NOT EXISTS idx_problem_associations_departmentid ON problem_associations(departmentid);
CREATE INDEX IF NOT EXISTS idx_problem_associations_semesterid ON problem_associations(semesterid);
CREATE INDEX IF NOT EXISTS idx_problem_associations_courseid ON problem_associations(courseid);
CREATE INDEX IF NOT EXISTS idx_course_departmentid ON course(departmentid);
CREATE INDEX IF NOT EXISTS idx_course_semesterid ON course(semesterid);