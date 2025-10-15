import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateFieldInput, Field } from "@/types/template";

interface PreviewFormElementProps {
  field: Field | CreateFieldInput;
}

export const PreviewFormElement = ({ field }: PreviewFormElementProps) => {
  return (
    <div
      className={`space-y-1 ${field.fieldType === "textarea" ? "col-span-2" : ""}`}
    >
      <label
        htmlFor={`preview-${field.fieldName}`}
        className="text-sm font-medium"
      >
        {field.fieldLabel || "Nhãn trường"}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.fieldType === "textarea" ? (
        <Textarea
          id={`preview-${field.fieldName}`}
          placeholder={field.placeholder || ""}
          disabled
          className="bg-background"
          rows={3}
        />
      ) : field.fieldType === "select" ? (
        <Input
          id={`preview-${field.fieldName}`}
          placeholder={field.placeholder || "Chọn..."}
          disabled
          className="bg-background"
        />
      ) : (
        <Input
          id={`preview-${field.fieldName}`}
          type={
            field.fieldType === "number"
              ? "number"
              : field.fieldType === "date"
                ? "date"
                : "text"
          }
          placeholder={field.placeholder || ""}
          disabled
          className="bg-background"
        />
      )}

      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
};
