import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function formatFieldValue(field: {
  fieldValue?: unknown;
  fieldType?: string;
  fieldLabel?: string;
}): string {
  if (!field || field.fieldValue === null || field.fieldValue === undefined) {
    return "-";
  }

  const value = field.fieldValue;

  if (typeof value === "string" && value.trim() === "") {
    return "-";
  }

  if (!field.fieldType) {
    return String(value);
  }

  switch (field.fieldType) {
    case "date": {
      try {
        const dateValue = new Date(value as string);
        if (Number.isNaN(dateValue.getTime())) {
          return String(value);
        }
        return format(dateValue, "dd/MM/yyyy", { locale: vi });
      } catch {
        return String(value);
      }
    }

    case "number": {
      const numValue = Number(value);
      if (Number.isNaN(numValue)) {
        return String(value);
      }
      return new Intl.NumberFormat("vi-VN").format(numValue);
    }

    case "currency": {
      const currencyValue = Number(value);
      if (Number.isNaN(currencyValue)) {
        return String(value);
      }
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(currencyValue);
    }

    case "percentage": {
      const percentValue = Number(value);
      if (Number.isNaN(percentValue)) {
        return String(value);
      }
      return `${percentValue}%`;
    }

    case "boolean": {
      if (typeof value === "boolean") {
        return value ? "Có" : "Không";
      }
      const strValue = String(value).toLowerCase();
      if (strValue === "true" || strValue === "1") return "Có";
      if (strValue === "false" || strValue === "0") return "Không";
      return String(value);
    }

    default:
      return String(value);
  }
}

