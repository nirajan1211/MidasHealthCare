export const FORM_CONSTANTS = {
  GENDER_OPTIONS: [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ],

  RELATIONSHIP_OPTIONS: [
    { label: "Self", value: "0" },
    { label: "Father", value: "1" },
    { label: "Mother", value: "2" },
    { label: "Spouse", value: "3" },
    { label: "Son", value: "4" },
    { label: "Daughter", value: "5" },
    { label: "Brother", value: "6" },
    { label: "Sister", value: "7" },
    { label: "Grandfather", value: "8" },
    { label: "Grandmother", value: "9" },
    { label: "Other", value: "10" },
  ],

  DISTRICTS: [
    {
      label: "Kathmandu",
      value: "1",
      vdcMunicipalities: [
        { label: "Kathmandu Metropolitan City", value: "1147" },
        { label: "Budhanilkantha Municipality", value: "1148" },
        { label: "Shankharapur Municipality", value: "1149" },
        { label: "Nagarjun Municipality", value: "1150" },
        { label: "Tarakeshwar Municipality", value: "1151" },
        { label: "Tokha Municipality", value: "1152" },
        { label: "Kirtipur Municipality", value: "1153" },
        { label: "Madhyapur Thimi Municipality", value: "1154" },
        { label: "Bhaktapur Municipality", value: "1155" },
        { label: "Suryabinayak Municipality", value: "1156" },
        { label: "Changunarayan Municipality", value: "1157" },
      ],
    },
    {
      label: "Lalitpur",
      value: "2",
      vdcMunicipalities: [
        { label: "Lalitpur Metropolitan City", value: "2147" },
        { label: "Godawari Municipality", value: "2148" },
        { label: "Mahalaxmi Municipality", value: "2149" },
        { label: "Konjyosom Rural Municipality", value: "2150" },
        { label: "Bagmati Rural Municipality", value: "2151" },
      ],
    },
    {
      label: "Bhaktapur",
      value: "3",
      vdcMunicipalities: [
        { label: "Bhaktapur Municipality", value: "3147" },
        { label: "Changunarayan Municipality", value: "3148" },
        { label: "Madhyapur Thimi Municipality", value: "3149" },
        { label: "Suryabinayak Municipality", value: "3150" },
      ],
    },
    {
      label: "Achham",
      value: "45",
      vdcMunicipalities: [
        { label: "Mangalsen Municipality", value: "4501" },
        { label: "Kamalbazar Municipality", value: "4502" },
        { label: "Sanfebagar Municipality", value: "4503" },
      ],
    },
  ],

  AGE_TYPES: [
    { label: "Years", value: "Years" },
    { label: "Months", value: "Months" },
    { label: "Days", value: "Days" },
  ],

  COUNTRY_CODES: [
    { label: "+977", value: "977" },
    { label: "+91", value: "91" },
    { label: "+1", value: "1" },
  ],
};

export const VALIDATION_RULES = {
  email: {
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },

  mobileNumber: (countryCode: string) => ({
    required: "Phone number is required",
    pattern:
      countryCode === "977"
        ? {
            value: /^[0-9]{10}$/,
            message: "Phone number must be exactly 10 digits for Nepal (+977)",
          }
        : {
            value: /^[0-9]{10,12}$/,
            message: "Phone number must be 10-12 digits",
          },
  }),

  name: {
    required: "This field is required",
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: "Only letters and spaces are allowed",
    },
  },

  wardNo: {
    required: "Ward number is required",
    pattern: {
      value: /^[0-9]+$/,
      message: "Ward number must be a valid number",
    },
    min: {
      value: 1,
      message: "Ward number must be at least 1",
    },
    max: {
      value: 35,
      message: "Ward number cannot exceed 35",
    },
  },
};

export const calculateAge = (
  birthDate: string
): { years: number; months: number; days: number } | null => {
  if (!birthDate) return null;

  try {
    let dateObj: Date;
    if (birthDate.includes("/")) {
      const [year, month, day] = birthDate.split("/");
      dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (birthDate.includes("-")) {
      dateObj = new Date(birthDate);
    } else {
      return null;
    }

    const today = new Date();
    const birthYear = dateObj.getFullYear();
    const birthMonth = dateObj.getMonth();
    const birthDay = dateObj.getDate();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let years = currentYear - birthYear;
    let months = currentMonth - birthMonth;
    let days = currentDay - birthDay;

    if (days < 0) {
      months--;
      days += new Date(currentYear, currentMonth, 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
};

export interface PatientFormData {
  fname: string;
  lname: string;
  mname?: string;
  email?: string;
  mobileno: string;
  countrycode: string;
  gender: string;
  relationid: string;
  address?: string;
  districtid: string;
  vdcid: string;
  wardno: string;
  dateofbirth?: string;
  age?: string;
  agetype: string;
}

export interface PatientFormProps {
  mode?: "add" | "edit";
  initialData?: Partial<PatientFormData>;
  onSubmit?: (data: PatientFormData) => void;
}
