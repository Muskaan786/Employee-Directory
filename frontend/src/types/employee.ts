export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  date_of_joining: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  detail: string;
}
