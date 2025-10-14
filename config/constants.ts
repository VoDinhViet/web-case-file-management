export const APP_NAME = "Case Management System";
export const APP_VERSION = "1.0.0";

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CASE_STATUS_COLORS = {
  open: "bg-blue-500",
  in_progress: "bg-yellow-500",
  pending: "bg-orange-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
} as const;

export const PRIORITY_COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
} as const;
