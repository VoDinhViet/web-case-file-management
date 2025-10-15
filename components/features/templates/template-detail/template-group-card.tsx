import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Group } from "@/types/template";
import { getFieldTypeColor, getFieldTypeIcon } from "./field-type-utils";

interface TemplateGroupCardProps {
  group: Group;
  index: number;
}

export function TemplateGroupCard({ group, index }: TemplateGroupCardProps) {
  return (
    <Card className="overflow-hidden pt-0 border-slate-200 dark:border-slate-800">
      <CardHeader className=" border-b pt-4 !pb-2 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 text-lg font-bold text-primary px-3 py-1">
            {index + 1}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{group.title}</CardTitle>
            {group.description && (
              <CardDescription className="mt-1">
                {group.description}
              </CardDescription>
            )}
            <Badge variant="outline" className="mt-2">
              {group.fields.length} trường
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {group.fields.map((field) => {
            const Icon = getFieldTypeIcon(field.fieldType);
            const colorClass = getFieldTypeColor(field.fieldType);
            return (
              <div
                key={field.id}
                className={`group relative p-3 rounded-lg border bg-card hover:shadow-md hover:border-primary/50 transition-all duration-200 ${
                  field.fieldType === "textarea"
                    ? "md:col-span-2 lg:col-span-3"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded ${colorClass}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-sm font-medium">{field.fieldLabel}</p>
                      {field.isRequired && (
                        <Badge variant="destructive" className="text-xs h-5">
                          Bắt buộc
                        </Badge>
                      )}
                    </div>
                    <div className="ml-8 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Loại:</span>{" "}
                        {field.fieldType.charAt(0).toUpperCase() +
                          field.fieldType.slice(1)}
                      </p>
                      {field.fieldName && (
                        <p className="text-xs text-muted-foreground font-mono">
                          <span className="font-medium">Key:</span>{" "}
                          {field.fieldName}
                        </p>
                      )}
                      {field.description && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Mô tả:</span>{" "}
                          {field.description}
                        </p>
                      )}
                      {field.placeholder && (
                        <p className="text-xs text-muted-foreground italic">
                          <span className="font-medium not-italic">
                            Placeholder:
                          </span>{" "}
                          {field.placeholder}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
