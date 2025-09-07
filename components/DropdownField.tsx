import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, View } from "react-native";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  rules?: object;
  error?: string;
  required?: boolean;
}

const DropdownField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  rules,
  error,
  required = false,
}: DropdownFieldProps<T>) => {
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
          <View
            className={`bg-white border rounded-lg ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <Picker
              selectedValue={value || ""}
              onValueChange={onChange}
              style={{
                height: 50,
                color: value ? "#111827" : "#9CA3AF",
              }}
            >
              <Picker.Item label={placeholder} value="" color="#9CA3AF" />
              {options.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color="#111827"
                />
              ))}
            </Picker>
          </View>
        )}
      />

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default DropdownField;
