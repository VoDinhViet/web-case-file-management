import { Calendar, FileText, Hash, List, Type } from "lucide-react";
import type { FieldType } from "@/types/template";

export function getFieldTypeIcon(fieldType: FieldType) {
  switch (fieldType) {
    case "text":
      return FileText;
    case "number":
      return Hash;
    case "select":
      return List;
    case "date":
      return Calendar;
    case "textarea":
      return Type;
    default:
      return FileText;
  }
}

export function getFieldTypeColor(fieldType: FieldType) {
  switch (fieldType) {
    case "text":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950";
    case "number":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950";
    case "select":
      return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950";
    case "date":
      return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-950";
    case "textarea":
      return "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-950";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-950";
  }
}

export const basicFieldsConfig = [
  {
    id: "case_name",
    label: "Tên vụ án",
    type: "text" as FieldType,
    required: true,
  },
  { id: "law", label: "Điều", type: "text" as FieldType },
  {
    id: "assigned_user",
    label: "Cán bộ thụ lý",
    type: "select" as FieldType,
  },
  {
    id: "defendants",
    label: "Số bị can",
    type: "number" as FieldType,
  },
  {
    id: "crime_type",
    label: "Loại tội phạm",
    type: "text" as FieldType,
  },
  {
    id: "start_date",
    label: "Ngày khởi tố",
    type: "date" as FieldType,
  },
  {
    id: "end_date",
    label: "Ngày hết hạn",
    type: "date" as FieldType,
  },
  {
    id: "description",
    label: "Mô tả vụ án",
    type: "textarea" as FieldType,
    span: true,
  },
];
