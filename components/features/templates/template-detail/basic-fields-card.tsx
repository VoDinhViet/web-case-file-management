import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  basicFieldsConfig,
  getFieldTypeColor,
  getFieldTypeIcon,
} from "./field-type-utils";

export function BasicFieldsCard() {
  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Thông tin cơ bản
            </CardTitle>
            <CardDescription className="mt-1">
              Các trường cơ bản có sẵn trong mọi vụ án
            </CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800">
            Mặc định
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {basicFieldsConfig.map((field) => {
            const Icon = getFieldTypeIcon(field.type);
            const colorClass = getFieldTypeColor(field.type);
            return (
              <div
                key={field.id}
                className={`group relative p-3 rounded-lg border bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-200 ${
                  field.span ? "md:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded ${colorClass}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-sm font-medium">{field.label}</p>
                      {field.required && (
                        <Badge className="text-xs h-5" variant="outline">
                          Bắt buộc
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">
                      {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                    </p>
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
