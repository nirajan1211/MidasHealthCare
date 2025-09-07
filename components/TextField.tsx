import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface TextFieldProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  rules?: object;
  error?: string;
  required?: boolean;
}

const TextField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  error,
  required = false,
  ...textInputProps
}: TextFieldProps<T>) => {
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
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`bg-white border rounded-lg px-4 py-3 text-gray-900 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value || ""}
            {...textInputProps}
          />
        )}
      />

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default TextField;
