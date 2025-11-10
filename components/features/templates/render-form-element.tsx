import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CreateFieldInput, Field } from "@/types/template";

interface RenderFormElementProps {
  formElement: Field | CreateFieldInput;
  form: UseFormReturn<Record<string, unknown>>;
  namePrefix?: string; // 👈 để hỗ trợ lồng { fields.xxx }
}

export const RenderFormElement = ({
  formElement,
  form,
  namePrefix,
}: RenderFormElementProps) => {
  const name = namePrefix
    ? `${namePrefix}.${formElement.fieldName}`
    : formElement.fieldName;

  switch (formElement.fieldType) {
    case "text":
    case "number":
      return (
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={name}
            render={({ field }: { field: ControllerRenderProps }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {formElement.fieldLabel}{" "}
                  {formElement.isRequired && (
                    <span className="text-red-500"> *</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    type={
                      formElement.fieldType === "number" ? "number" : "text"
                    }
                    placeholder={formElement.placeholder}
                    onChange={(e) =>
                      field.onChange(
                        formElement.fieldType === "number"
                          ? e.target.valueAsNumber
                          : e.target.value,
                      )
                    }
                  />
                </FormControl>
                {formElement.description && (
                  <FormDescription>{formElement.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={name}
            render={({ field }: { field: ControllerRenderProps }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {formElement.fieldLabel}{" "}
                  {formElement.isRequired && (
                    <span className="text-red-500"> *</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder={formElement.placeholder}
                  />
                </FormControl>
                {formElement.description && (
                  <FormDescription>{formElement.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case "date":
      return (
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => {
              const dateValue = field.value as Date | undefined;
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {formElement.fieldLabel}{" "}
                    {formElement.isRequired && (
                      <span className="text-red-500"> *</span>
                    )}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !dateValue && "text-muted-foreground",
                          )}
                        >
                          {dateValue ? (
                            format(dateValue, "dd/MM/yyyy")
                          ) : (
                            <span>
                              {formElement.placeholder || "Chọn ngày"}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={vi}
                        mode="single"
                        selected={dateValue}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {formElement.description && (
                    <FormDescription>{formElement.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      );

    default:
      return (
        <div className="text-muted-foreground text-sm">
          Unsupported field type: {formElement.fieldType}
        </div>
      );
  }
};
