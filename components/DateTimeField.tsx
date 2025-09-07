import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface DateTimeFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  mode?: "date" | "time" | "datetime";
  rules?: object;
  error?: string;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DateTimeField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select date",
  mode = "date",
  rules,
  error,
  required = false,
  minimumDate,
  maximumDate,
}: DateTimeFieldProps<T>) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | null, mode: string) => {
    if (!date) return "";

    switch (mode) {
      case "time":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "datetime":
        return date.toLocaleString([], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      default:
        return date.toLocaleDateString();
    }
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              className={`bg-white border rounded-lg px-4 py-3 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              onPress={() => setShowPicker(true)}
            >
              <Text className={`${value ? "text-gray-900" : "text-gray-400"}`}>
                {value ? formatDate(new Date(value), mode) : placeholder}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode={mode}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowPicker(Platform.OS === "ios");
                  if (selectedDate) {
                    onChange(selectedDate.toISOString());
                  }
                }}
              />
            )}
          </>
        )}
      />

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default DateTimeField;
