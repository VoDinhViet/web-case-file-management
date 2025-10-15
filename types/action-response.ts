import type { Pagination } from "./pagination";

// Generic action response interface
export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Action response with message
export interface ActionResponseWithMessage<T = void> extends ActionResponse<T> {
  message?: string;
}

// Action response with pagination
export interface ActionResponseWithPagination<T = void>
  extends ActionResponse<T> {
  pagination?: Pagination;
}
