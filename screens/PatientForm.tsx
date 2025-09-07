import DateTimeField from "@/components/DateTimeField";
import DropdownField from "@/components/DropdownField";
import TextField from "@/components/TextField";
import {
  calculateAge,
  FORM_CONSTANTS,
  PatientFormData,
  PatientFormProps,
  VALIDATION_RULES,
} from "@/constants/PatientFormConstants";
import {
  useAddPatientMutation,
  useUpdatePatientMutation,
} from "@/store/api/patientApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PatientForm: React.FC<PatientFormProps> = ({
  mode = "add",
  initialData = {},
  onSubmit: onSubmitProp,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [addPatient, { isLoading: isAdding }] = useAddPatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [availableVdcs, setAvailableVdcs] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const isEditMode = mode === "edit" || (route.params as any)?.patient;
  const patientData = (route.params as any)?.patient || initialData;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<PatientFormData>({
    defaultValues: {
      fname: patientData?.fname || "",
      lname: patientData?.lname || "",
      mname: patientData?.mname || "",
      email: patientData?.email || patientData?.emailaddress || "",
      mobileno: patientData?.mobileno || patientData?.mobilenumber || "",
      countrycode: patientData?.countrycode || "977",
      gender: patientData?.gender || "",
      relationid: patientData?.relationid || "",
      address: patientData?.address || "",
      districtid: patientData?.districtid || "",
      vdcid: patientData?.vdcid || "",
      wardno: patientData?.wardno || "",
      dateofbirth: patientData?.dateofbirth || patientData?.dobad || "",
      age: patientData?.age || "",
      agetype: patientData?.agetype || "Years",
    },
  });

  const watchedValues = watch(["dateofbirth", "districtid", "countrycode"]);
  const [dateOfBirth, selectedDistrict, countryCode] = watchedValues;

  useEffect(() => {
    if (selectedDistrict) {
      const district = FORM_CONSTANTS.DISTRICTS.find(
        (d) => d.value === selectedDistrict
      );
      if (district) {
        setAvailableVdcs(district.vdcMunicipalities);
        setValue("vdcid", "");
        clearErrors("vdcid");
      }
    } else {
      setAvailableVdcs([]);
    }
  }, [selectedDistrict, setValue, clearErrors]);

  useEffect(() => {
    if (dateOfBirth) {
      const ageData = calculateAge(dateOfBirth);
      if (ageData) {
        const { years, months, days } = ageData;

        if (years > 0) {
          setValue("age", years.toString());
          setValue("agetype", "Years");
        } else if (months > 0) {
          setValue("age", months.toString());
          setValue("agetype", "Months");
        } else if (days > 0) {
          setValue("age", days.toString());
          setValue("agetype", "Days");
        }

        clearErrors("age");
      }
    }
  }, [dateOfBirth, setValue, clearErrors]);

  const genderOptions = [
    { label: "Male", value: "Male", icon: "♂" },
    { label: "Female", value: "Female", icon: "♀" },
    { label: "Other", value: "Other", icon: "⚧" },
  ];

  const GenderSelector = ({ value, onChange, error }: any) => {
    return (
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Gender <Text className="text-red-500">*</Text>
        </Text>
        <View className="flex-row gap-3">
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              className={`flex-1 items-center py-3 px-4 rounded-lg border ${
                value === option.value
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text className="text-2xl mb-1">{option.icon}</Text>
              <Text
                className={`text-sm font-medium ${
                  value === option.value ? "text-teal-600" : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      </View>
    );
  };

  const onSubmit = async (data: PatientFormData) => {
    if (onSubmitProp) {
      onSubmitProp(data);
      return;
    }

    try {
      const patientPayload = {
        fname: data.fname.trim(),
        lname: data.lname.trim(),
        mname: data.mname?.trim() || "",
        email: data.email?.trim() || "",
        mobileno: data.mobileno.trim(),
        countrycode: data.countrycode,
        gender: data.gender,
        relationid: data.relationid,
        address: data.address?.trim() || "",
        districtid: data.districtid,
        vdcid: data.vdcid,
        wardno: data.wardno.trim(),
        dateofbirth: data.dateofbirth || "",
        age: data.age || "",
        agetype: data.agetype,
        addtorelative: "Y",
      };

      console.log("Submitting patient data:", patientPayload);

      let result;
      if (isEditMode && patientData?.userid) {
        console.log("Updating patient with userid:", patientData.userid);
        result = await updatePatient({
          ...patientPayload,
          userid: patientData.userid,
        }).unwrap();
      } else {
        console.log("Adding new patient");
        result = await addPatient(patientPayload).unwrap();
      }

      console.log("API Response:", result);

      Alert.alert(
        "Success",
        `Patient ${isEditMode ? "updated" : "added"} successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Patient operation error:", error);

      let errorMessage = `Failed to ${isEditMode ? "update" : "add"} patient. Please try again.`;

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Edit Patient" : "Add New Patient"}
        </Text>

        <View className="flex-row space-x-2 mb-4">
          <View className="flex-1">
            <TextField
              name="fname"
              control={control}
              label="First Name"
              placeholder="Enter your first name..."
              required
              rules={{
                ...VALIDATION_RULES.name,
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
              }}
              error={errors.fname?.message}
              autoCapitalize="words"
            />
          </View>
          <View className="flex-1">
            <TextField
              name="lname"
              control={control}
              label="Last Name"
              placeholder="Enter your last name..."
              required
              rules={{
                ...VALIDATION_RULES.name,
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              }}
              error={errors.lname?.message}
              autoCapitalize="words"
            />
          </View>
        </View>

        <GenderSelector
          value={watch("gender")}
          onChange={(value: string) => setValue("gender", value)}
          error={errors.gender?.message}
        />

        <View className="flex-row space-x-2 mb-4">
          <View className="flex-1">
            <TextField
              name="age"
              control={control}
              label="Age"
              placeholder="Age"
              keyboardType="numeric"
              rules={{
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Age must be a number",
                },
                min: { value: 0, message: "Age cannot be negative" },
                max: { value: 150, message: "Age cannot exceed 150 years" },
              }}
              error={errors.age?.message}
            />
          </View>
          <View className="flex-1">
            <DropdownField
              name="agetype"
              control={control}
              label="Age Type"
              placeholder="Year"
              options={FORM_CONSTANTS.AGE_TYPES}
            />
          </View>
        </View>

        <DateTimeField
          name="dateofbirth"
          control={control}
          label="Date of Birth"
          placeholder="YYYY/MM/DD"
          mode="date"
        />

        <TextField
          name="email"
          control={control}
          label="Email Address"
          placeholder="Enter email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          rules={VALIDATION_RULES.email}
          error={errors.email?.message}
        />

        <Text className="text-sm font-medium text-gray-700 mb-2">
          Phone Number <Text className="text-red-500">*</Text>
        </Text>
        <View className="flex-row space-x-2 mb-4">
          <View className="w-24">
            <DropdownField
              name="countrycode"
              control={control}
              placeholder="+977"
              options={FORM_CONSTANTS.COUNTRY_CODES}
            />
          </View>
          <View className="flex-1">
            <TextField
              name="mobileno"
              control={control}
              placeholder={
                countryCode === "977" ? "Phone Number" : "Phone Number"
              }
              keyboardType="phone-pad"
              required
              rules={VALIDATION_RULES.mobileNumber(countryCode)}
              error={errors.mobileno?.message}
              maxLength={countryCode === "977" ? 10 : 12}
            />
          </View>
        </View>

        <DropdownField
          name="relationid"
          control={control}
          label="Relationship"
          placeholder="Other"
          options={FORM_CONSTANTS.RELATIONSHIP_OPTIONS}
          required
          rules={{ required: "Relationship is required" }}
          error={errors.relationid?.message}
        />

        <View className="flex-row space-x-2 mb-4">
          <View className="flex-1">
            <DropdownField
              name="districtid"
              control={control}
              label="Select District"
              placeholder="Select District"
              options={FORM_CONSTANTS.DISTRICTS}
              required
              rules={{ required: "District is required" }}
              error={errors.districtid?.message}
            />
          </View>
          <View className="flex-1">
            <DropdownField
              name="vdcid"
              control={control}
              label="Select VDC/Municipality"
              placeholder="Select item"
              options={availableVdcs}
              required
              rules={{ required: "VDC/Municipality is required" }}
              error={errors.vdcid?.message}
            />
          </View>
        </View>

        <View className="flex-row space-x-2 mb-4">
          <View className="flex-1">
            <TextField
              name="wardno"
              control={control}
              label="Ward No"
              placeholder="Ward"
              keyboardType="numeric"
              required
              rules={VALIDATION_RULES.wardNo}
              error={errors.wardno?.message}
              maxLength={2}
            />
          </View>
          <View className="flex-1">
            <TextField
              name="address"
              control={control}
              label="Tole"
              placeholder="Tole"
            />
          </View>
        </View>

        <View className="mt-8 mb-4">
          <TouchableOpacity
            className={`w-full py-4 rounded-lg ${
              isAdding || isUpdating ? "bg-teal-400" : "bg-teal-600"
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isAdding || isUpdating}
            activeOpacity={0.8}
          >
            {isAdding || isUpdating ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-2 text-lg">
                  {isEditMode ? "Updating..." : "Saving..."}
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {isEditMode ? "Update Patient" : "Save Patient"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PatientForm;
