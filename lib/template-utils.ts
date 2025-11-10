import type { Template } from "@/types/template";

/**
 * Build default values object for dynamic fields generated from a template.
 */
export function buildTemplateDefaultValues(
  template: Template,
): Record<string, string | number | null> {
  return Object.fromEntries(
    template.groups.flatMap((group) =>
      group.fields.map((field) => {
        if (field.fieldType === "number") return [field.fieldName, null];
        if (field.fieldType === "date") return [field.fieldName, null];
        return [field.fieldName, ""];
      }),
    ),
  );
}

/**
 * Map values from a React Hook Form `fields` object to the expected payload structure.
 */
export function mapTemplateFields(
  template: Template,
  fields: Record<string, unknown>,
) {
  return template.groups.flatMap((group) =>
    group.fields.map((field) => {
      const raw = fields[field.fieldName];
      let value: string | undefined;

      if (raw === null || raw === undefined || raw === "") {
        value = undefined;
      } else if (field.fieldType === "date" && raw instanceof Date) {
        value = raw.toISOString();
      } else {
        value = String(raw);
      }

      return {
        groupId: group.id,
        fieldLabel: field.fieldLabel,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        isEdit: false,
        isRequired: field.isRequired,
        placeholder: field.placeholder ?? "",
        defaultValue: "",
        description: field.description ?? "",
        value,
      };
    }),
  );
}
