// Pagination types

export interface Pagination {
  limit: number;
  currentPage: number;
  nextPage: boolean;
  previousPage: boolean;
  totalRecords: number;
  totalPages: number;
}

// Generic interface for paginated API responses
// Usage example:
//   const response: PaginatedResponse<Staff> = await api.get("/api/v1/users");
//   const staffList = response.data;
//   const pagination = response.pagination;
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
