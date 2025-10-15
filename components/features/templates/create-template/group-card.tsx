"use client";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTemplateFormData } from "@/schemas/template";
import { FieldCard } from "./field-card";

interface GroupCardProps {
  groupIndex: number;
  form: UseFormReturn<CreateTemplateFormData>;
  onRemove: () => void;
  disabled: boolean;
  canRemove: boolean;
  totalGroups: number;
}

export function GroupCard({
  groupIndex,
  form,
  onRemove,
  disabled,
  canRemove,
  totalGroups,
}: GroupCardProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: `groups.${groupIndex}.fields`,
  });

  const addField = () => {
    append({
      fieldName: `field_${Date.now()}`,
      fieldLabel: "Trường mới",
      placeholder: "",
      fieldType: "text",
      isRequired: false,
      description: "",
      index: fields.length,
    });
  };

  const moveGroupUp = () => {
    if (groupIndex > 0) {
      const groups = form.getValues("groups");
      const temp = groups[groupIndex];
      groups[groupIndex] = groups[groupIndex - 1];
      groups[groupIndex - 1] = temp;
      form.setValue("groups", groups);
    }
  };

  const moveGroupDown = () => {
    if (groupIndex < totalGroups - 1) {
      const groups = form.getValues("groups");
      const temp = groups[groupIndex];
      groups[groupIndex] = groups[groupIndex + 1];
      groups[groupIndex + 1] = temp;
      form.setValue("groups", groups);
    }
  };

  return (
    <Card className="relative overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 h-full w-1 bg-primary" />

      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          {/* Group number */}
          <div className="mt-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
              {groupIndex + 1}
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 space-y-3">
            <FormField
              control={form.control}
              name={`groups.${groupIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 dark:text-slate-100">
                    Tiêu đề nhóm
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Thông tin đương sự"
                      {...field}
                      disabled={disabled}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`groups.${groupIndex}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 dark:text-slate-100">
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về nhóm này..."
                      {...field}
                      disabled={disabled}
                      rows={2}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {groupIndex > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={moveGroupUp}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            {groupIndex < totalGroups - 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={moveGroupDown}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content - Fields */}
      <CardContent className="space-y-3 pt-4">
        {/* Empty state */}
        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              Nhóm này chưa có trường nào
            </p>
          </div>
        )}

        {/* Fields */}
        {fields.map((field, fieldIndex) => (
          <FieldCard
            key={field.id}
            groupIndex={groupIndex}
            fieldIndex={fieldIndex}
            form={form}
            onRemove={() => remove(fieldIndex)}
            onMoveUp={() => {
              if (fieldIndex > 0) {
                move(fieldIndex, fieldIndex - 1);
              }
            }}
            onMoveDown={() => {
              if (fieldIndex < fields.length - 1) {
                move(fieldIndex, fieldIndex + 1);
              }
            }}
            disabled={disabled}
            canRemove={fields.length > 1}
            totalFields={fields.length}
          />
        ))}

        {/* Add field button */}
        <Button
          onClick={addField}
          variant="outline"
          size="sm"
          type="button"
          className="h-10 w-full border-dashed border-slate-300 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
          disabled={disabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm trường
        </Button>
      </CardContent>
    </Card>
  );
}
