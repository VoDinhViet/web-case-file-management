import { ChevronDown, ChevronUp, Trash, Type } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateTemplateFormData } from "@/schemas/template";
import { fieldTypes } from "./constants";

interface FieldCardProps {
  groupIndex: number;
  fieldIndex: number;
  form: UseFormReturn<CreateTemplateFormData>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled: boolean;
  canRemove: boolean;
  totalFields: number;
}

export function FieldCard({
  groupIndex,
  fieldIndex,
  form,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled,
  canRemove,
  totalFields,
}: FieldCardProps) {
  const fieldType = form.watch(
    `groups.${groupIndex}.fields.${fieldIndex}.fieldType`,
  );
  const currentFieldType = fieldTypes.find((t) => t.value === fieldType);
  const FieldIcon = currentFieldType?.icon || Type;

  return (
    <div className="rounded-lg border p-4 bg-background">
      <div className="flex items-start gap-3">
        {/* Field icon */}
        <div className="mt-2 flex-shrink-0">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700 dark:bg-slate-800">
            <FieldIcon className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        {/* Field content */}
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.fieldLabel`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                    Tên hiển thị
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Họ tên"
                      {...field}
                      disabled={disabled}
                      className="h-9 border-slate-200"
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate fieldName
                        const fieldName = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "_")
                          .replace(/[^a-z0-9_]/g, "");
                        form.setValue(
                          `groups.${groupIndex}.fields.${fieldIndex}.fieldName`,
                          fieldName,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.fieldName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                    Tên kỹ thuật
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: full_name"
                      {...field}
                      disabled={disabled}
                      className="h-9 border-slate-200 font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`groups.${groupIndex}.fields.${fieldIndex}.placeholder`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Placeholder (văn bản gợi ý)"
                    {...field}
                    disabled={disabled}
                    className="border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`groups.${groupIndex}.fields.${fieldIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Mô tả (gợi ý cho người điền)"
                    {...field}
                    disabled={disabled}
                    className="border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center gap-4">
            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.fieldType`}
              render={({ field }) => (
                <FormItem className="max-w-[200px] flex-1">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại trường" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Loại trường</SelectLabel>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4 text-slate-600" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.isRequired`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Bắt buộc
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Delete & Move buttons */}
        <div className="ml-2 flex flex-col items-center gap-1">
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
              className="mt-2 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          {fieldIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={disabled}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {fieldIndex < totalFields - 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={disabled}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
