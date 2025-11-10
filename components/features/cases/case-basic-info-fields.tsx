"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SelectStaffs } from "@/types";

interface CaseBasicInfoFieldsProps {
  form: UseFormReturn<Record<string, unknown>>;
  selectUsers: SelectStaffs[];
  disabled?: boolean;
}

export function CaseBasicInfoFields({
  form,
  selectUsers,
  disabled = false,
}: CaseBasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Tên vụ án <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên vụ án"
                  {...field}
                  value={(field.value as string) || ""}
                  disabled={disabled}
                />
              </FormControl>
              <FormDescription>Nhập tên vụ án</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="applicableLaw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điều</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập điều"
                  {...field}
                  value={(field.value as string) || ""}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cán bộ thụ lý</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
              >
                <FormControl>
                  <SelectTrigger disabled={disabled}>
                    <SelectValue placeholder="Chọn người thụ lý" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="numberOfDefendants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số bị can</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={(field.value as number) || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="crimeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại tội phạm</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: GH Lần 2..."
                  {...field}
                  value={(field.value as string) || ""}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Mô tả vụ án</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả vụ án"
                  className="resize-none"
                  rows={3}
                  {...field}
                  value={(field.value as string) || ""}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
