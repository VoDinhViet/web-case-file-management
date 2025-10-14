import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle, Circle, Clock } from "lucide-react";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: vi });
}

export function getPhaseStatus({
  isCompleted,
  endDate,
}: {
  isCompleted: boolean;
  endDate: Date | string;
}) {
  const now = new Date();
  const end = new Date(endDate);
  const isOverdue = !isCompleted && end < now;

  if (isCompleted) {
    return {
      icon: CheckCircle,
      iconClass: "text-green-600",
      dotClass: "bg-green-100 border-green-300",
    };
  }

  if (isOverdue) {
    return {
      icon: Clock,
      iconClass: "text-red-600",
      dotClass: "bg-red-100 border-red-300",
    };
  }

  return {
    icon: Circle,
    iconClass: "text-gray-600",
    dotClass: "bg-gray-100 border-gray-300",
  };
}
