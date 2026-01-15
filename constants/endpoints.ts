const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

if (!BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set in environment variables");
}

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    ME: `${BASE_URL}/auth/me`,
  },
  CHATBOT: `${BASE_URL}/chatbot`,
  ALL_STUDENTS: `${BASE_URL}/allstudents`,
  STUDENT_BY_ID: (id: number) => `${BASE_URL}/student/${id}`,
} as const;

// Individual exports for convenience
export const LOGIN_API_URL = ENDPOINTS.AUTH.LOGIN;
export const AUTH_ME_URL = ENDPOINTS.AUTH.ME;
export const CHATBOT_API_URL = ENDPOINTS.CHATBOT;
export const ALL_STUDENTS_URL = ENDPOINTS.ALL_STUDENTS;
export const getStudentByIdUrl = ENDPOINTS.STUDENT_BY_ID;
