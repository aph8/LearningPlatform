import axios from "axios";
import {
  Assignment,
  AssignmentRequest,
  CourseRequest,
  SubmissionRequest,
  Student,
  Course,
  AssignmentPatch,
  SignupData,
  User,
  Credentials,
  AssignmentWithQuestions,
} from "./apiTypes";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// === ASSIGNMENT API ===
export const assignmentApi = {
  createAssignment: (data: AssignmentRequest) =>
    apiClient.post("/assignments", data),
  getAllAssignments: () => apiClient.get<Assignment[]>("/assignments"),
  getAssignmentById: (assignmentId: string) =>
    apiClient.get<AssignmentWithQuestions>(`/assignments/${assignmentId}`),
  getAssignmentsByCourse: (courseId: string | number) =>
    apiClient.get<Assignment[]>(`/assignments/courses/${courseId}`),
  editAssignment: (assignmentId: string, data: AssignmentPatch) =>
    apiClient.patch(`/assignments/${assignmentId}`, data),
  deleteAssignment: (assignmentId: string) =>
    apiClient.delete(`/assignments/${assignmentId}`),
  getCanDelete: (assignmentId: number | string) =>
    apiClient.get<{ canDelete: boolean }>(
      `/assignments/${assignmentId}/can-delete`,
    ),
  getCanUnpublish: (assignmentId: number) =>
    apiClient.get<{ canUnpublish: boolean }>(
      `/assignments/${assignmentId}/can-unpublish`,
    ),
  grades: (assignmentId: string) =>
    apiClient.get(`/submissions/grades/${assignmentId}`),
};

// === COURSE API ===
export const courseApi = {
  createCourse: (data: CourseRequest) => apiClient.post("/courses", data),
  getAllCourses: () => apiClient.get<Course[]>("/courses"),
  getCoursesByUser: (userName: string) =>
    apiClient.get<Course[]>(`/courses/instructor/${userName}`),
  registerStudentInCourse: (courseId: string | number, userName: string) =>
    apiClient.post(`/courses/${courseId}/${userName}`),
  getAllStudentsByCourseId: (courseId: string | number) =>
    apiClient.get<Student[]>(`/courses/${courseId}/students`),
  getStudentByGradeCriteria: (courseId: string | number) =>
    apiClient.get(`/courses/${courseId}/students/grades`),
  getAllAssignmentsByCourseId: (courseId: string | number) =>
    apiClient.get<Assignment[]>(`/courses/${courseId}/assignments`),
  deleteStudentFromCourse: (courseId: string, studentId: string) =>
    apiClient.delete(`/courses/${courseId}/students/${studentId}`),
  getCourseById: (courseId: string) =>
    apiClient.get<Course>(`/courses/courses/${courseId}`),
  updateCourseDetails: (courseId: string, data: CourseRequest) =>
    apiClient.patch(`/courses/${courseId}`, data),
  deleteCourse: (courseId: number) => apiClient.delete(`/courses/${courseId}`),
};

// === LOGIN API ===
export const loginApi = {
  login: (credentials: Credentials) => apiClient.post("/login", credentials),
};

// === SIGNUP API ===
export const signupApi = {
  signUp: (data: SignupData) => apiClient.post("/signup", data),
};

// === SUBMISSIONS API ===
export const submissionApi = {
  averageGrade: (assignmentId: string) =>
    apiClient.get(`/submissions/average/${assignmentId}`),
  grades: (assignmentId: string) =>
    apiClient.get(`/submissions/grades/${assignmentId}`),
  hasBeenSubmitted: (assignmentId: string, userName: string) =>
    apiClient.get(`/submissions/status/${assignmentId}?userName=${userName}`),
  assignmentGradesByStudent: (assignmentId: string, userName: string) =>
    apiClient.get(
      `/submissions/grades/student/${assignmentId}?userName=${userName}`,
    ),
  submitAssignment: (data: SubmissionRequest) =>
    apiClient.post("/submissions", data),
  allGrades: (assignmentId: string) =>
    apiClient.get(`/submissions/allgrades/${assignmentId}`),
};

// === STUDENT API ===
export const studentApi = {
  getStudentByUserName: (userName: string) =>
    apiClient.get(`/students/student/${userName}`),
  hasStudentSubmitted: (userName: string, assignmentId: string) =>
    apiClient.get(`/students/student/${userName}/assignments/${assignmentId}`),
  getAverageGradeForStudent: (userName: string) =>
    apiClient.get(`/students/student/${userName}/average`),
  getAllGradesGroupedByCourse: (userName: string) =>
    apiClient.get(`/students/${userName}/grades-overview`),
};

// === USER API ===
export const userApi = {
  register: (data: SignupData) => apiClient.post("/users/register", data),
  getAllUsers: () => apiClient.get("/users"),
  getUserInfo: (userName: string) => apiClient.get(`/users/${userName}`),
  deleteAccount: (userName: string) => apiClient.delete(`/users/${userName}`),
  updateUser: (userName: string, data: Partial<User>) =>
    apiClient.patch(`/users/${userName}`, data),
};
