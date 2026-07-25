import React from "react";

import {
  type FieldValues,
  type UseFormRegister,
  type Path,
  Controller,
  type Control,
  type RegisterOptions,
} from "react-hook-form";

import {
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
} from "@remixicon/react";

import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

import type { FormCol } from "./Form";

import { Badge } from "../ui/badge";

import { cairo } from "@/lib/dayjs";
import { formatDate } from "@/lib/formatDate";

export type InputType =
  | "text"
  | "number"
  | "select"
  | "switch"
  | "textarea"
  | "date"
  | "password"
  | "date&time"
  | "tel"
  | "url"
  | "file"
  | "checkbox";

export type Option = {
  label: string;
  value: string;
};

export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  type: InputType;
  label?: string;
  col?: FormCol;
  readOnly?: boolean;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
  options?: Option[];
  dir?: "rtl" | "ltr";
  onChange?: (value: unknown) => void;
};

interface RenderInputFieldProps<T extends FieldValues> {
  config: FieldConfig<T>;
  control: Control<T>;
  register: UseFormRegister<T>;
}

export default function RenderInputField<T extends FieldValues>({
  config,
  register,
  control,
}: RenderInputFieldProps<T>) {
  const [open, setOpen] = React.useState(false);

  const handleChange = (value: unknown) => {
    config.onChange?.(value);
  };

  const getPropsInput = (
    config: FieldConfig<T>,
  ): React.ComponentProps<"input"> => {
    const registerOption: RegisterOptions<T> = {
      onChange: (e) => handleChange(e.target.value),
    };

    if (config.type === "number") {
      registerOption.valueAsNumber = true;
    }

    return {
      readOnly: config.readOnly,
      id: String(config.name),
      type: config.type,
      placeholder: config.placeholder,
      disabled: config.disabled,
      dir: config.dir
        ? config.dir
        : ["password", "url", "tel", "number"].includes(config.type)
          ? "ltr"
          : "rtl",
      ...register(config.name, registerOption),
    };
  };

  const getPropsTextarea = (
    config: FieldConfig<T>,
  ): React.ComponentProps<"textarea"> => {
    const registerOption: RegisterOptions<T> = {
      onChange: (e) => handleChange(e.target.value),
    };

    if (config.type === "number") {
      registerOption.valueAsNumber = true;
    }

    return {
      readOnly: config.readOnly,
      id: String(config.name),
      placeholder: config.placeholder,
      disabled: config.disabled,
      ...register(config.name, registerOption),
    };
  };

  switch (config.type) {
    case "text":
    case "password":
    case "url":
    case "tel":
    case "number":
    case "checkbox":
      return <Input {...getPropsInput(config)} />;
    case "textarea":
      return <Textarea {...getPropsTextarea(config)} />;
    case "select":
      return (
        <Controller
          name={config.name}
          control={control}
          render={({ field }) => (
            <Select
              value={(field.value as string) || ""}
              onValueChange={(value) => {
                field.onChange(value);
                handleChange(value);
              }}
              disabled={config.disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={config.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {config.options?.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      );
    case "switch":
      return (
        <Controller
          name={config.name}
          control={control}
          render={({ field }) => (
            <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
              <Badge variant={field.value ? "default" : "destructive"} asChild>
                {field.value ? (
                  <span>
                    مفعل
                    <RiCheckboxCircleFill />
                  </span>
                ) : (
                  <span>
                    غير مفعل
                    <RiCloseCircleFill />
                  </span>
                )}
              </Badge>
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(value) => {
                  field.onChange(value);
                  handleChange(value);
                }}
                disabled={config.disabled}
              />
            </div>
          )}
        />
      );

    case "date":
      return (
        <Controller
          name={config.name}
          control={control}
          render={({ field }) => {
            const value = field.value ? cairo(field.value).toDate() : undefined;
            return (
              <Popover>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                    dir="rtl"
                  >
                    {field.value ? (
                      formatDate(field.value, "date")
                    ) : (
                      <span>{config.placeholder || "اختر التاريخ"}</span>
                    )}

                    <RiCalendarLine className="mr-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start" dir="rtl">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                      if (!date) return;

                      const value = cairo(date).format("YYYY-MM-DD");

                      field.onChange(value);
                      handleChange(value);
                    }}
                    disabled={config.disabled}
                    dir="rtl"
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
      );

    case "date&time":
      return (
        <Controller
          name={config.name}
          control={control}
          render={({ field }) => {
            const value = field.value ? cairo(field.value) : undefined;

            const handleDateChange = (selectedDate?: Date) => {
              if (!selectedDate) return;

              const newValue = cairo(selectedDate)
                .hour(value?.hour() ?? 0)
                .minute(value?.minute() ?? 0)
                .second(0)
                .millisecond(0);

              const iso = newValue.toISOString();

              field.onChange(iso);
              handleChange(iso);
            };

            const handleTimeChange = (
              e: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);

              const newValue = (value ?? cairo())
                .hour(hours)
                .minute(minutes)
                .second(0)
                .millisecond(0);

              const iso = newValue.toISOString();

              field.onChange(iso);
              handleChange(iso);
            };

            return (
              <div className="flex gap-2" dir="rtl">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild className="w-full">
                    <Button
                      variant="outline"
                      className="flex-1 justify-between font-normal text-right"
                    >
                      {field.value ? (
                        formatDate(field.value, "date")
                      ) : (
                        <span className="text-muted-foreground">
                          {config.placeholder || "اختر التاريخ"}
                        </span>
                      )}

                      <RiCalendarLine className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    dir="rtl"
                  >
                    <Calendar
                      mode="single"
                      selected={value?.toDate()}
                      onSelect={(date) => {
                        handleDateChange(date);
                        setOpen(false);
                      }}
                      disabled={config.disabled}
                      dir="rtl"
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  className="w-30 text-center"
                  disabled={config.disabled}
                  value={field.value ? cairo(field.value).format("HH:mm") : ""}
                  onChange={handleTimeChange}
                />
              </div>
            );
          }}
        />
      );

    case "file":
      return (
        <Controller
          name={config.name}
          control={control}
          render={({ field }) => (
            <Input
              id={String(config.name)}
              type="file"
              accept={config.accept}
              disabled={config.disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file);
                handleChange(file);
              }}
            />
          )}
        />
      );
    default:
      return null;
  }
}
