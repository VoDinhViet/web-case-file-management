import {
  Calendar as CalendarIcon,
  Hash,
  List,
  Text as TextIcon,
  Type,
} from "lucide-react";

export const fieldTypes = [
  { value: "text", label: "Text", icon: TextIcon },
  { value: "number", label: "Number", icon: Hash },
  { value: "select", label: "Select", icon: List },
  { value: "date", label: "Date", icon: CalendarIcon },
  { value: "textarea", label: "Textarea", icon: Type },
] as const;
