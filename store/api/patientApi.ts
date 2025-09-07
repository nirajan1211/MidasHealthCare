import { baseApi } from "./baseApi";

export interface Patient {
  userid: string;
  fname: string;
  lname: string;
  mname?: string;
  email?: string;
  emailaddress?: string;
  mobileno?: string;
  mobilenumber?: string;
  countrycode?: string;
  relationname?: string;
  relationid?: string;
  gender: string;
  dobad?: string;
  dateofbirth?: string;
  age?: string;
  agetype?: string;
  image?: string;
  address?: string;
  bloodgroup?: string;
  user_type: string;
  relativemidasuserid?: string;
  districtid?: string;
  vdcid?: string;
  wardno?: string;
  addtorelative?: string;
}

export interface MyProfile {
  userid: string;
  fname: string;
  lname: string;
  mname?: string;
  emailaddress?: string;
  mobilenumber: string;
  gender: string;
  dobad?: string;
  image?: string;
  address?: string;
  bloodgroup?: string;
  user_type: string;
}

export interface PatientListResponse {
  message: string;
  response: {
    list: Patient[];
    my: MyProfile;
    userid: string;
  };
  type: string;
}

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientList: builder.query<PatientListResponse, void>({
      query: () => ({
        url: "user/showrelatives",
        method: "POST",
        body: new URLSearchParams({
          userid: "1000596100",
          orgid: "614",
        }).toString(),
      }),
      providesTags: ["Relatives"],
    }),

    addPatient: builder.mutation<PatientListResponse, Partial<Patient>>({
      query: (patientData) => ({
        url: "user/addrelatives",
        method: "POST",
        body: new URLSearchParams({
          userid: "1000596100",
          orgid: "614",
          fname: patientData.fname || "",
          lname: patientData.lname || "",
          mname: patientData.mname || "",
          age: patientData.age || "",
          agetype: patientData.agetype || "Years",
          countrycode: patientData.countrycode || "977",
          mobileno: patientData.mobileno || "",
          email: patientData.email || "",
          gender: patientData.gender || "",
          relationid: patientData.relationid || "",
          address: patientData.address || "",
          districtid: patientData.districtid || "",
          vdcid: patientData.vdcid || "",
          wardno: patientData.wardno || "",
          dateofbirth: patientData.dateofbirth || "",
          addtorelative: "Y",
        }).toString(),
      }),
      invalidatesTags: ["Relatives"],
    }),

    updatePatient: builder.mutation<
      PatientListResponse,
      Partial<Patient> & { userid: string }
    >({
      query: (patientData) => ({
        url: "user/updaterelative",
        method: "POST",
        body: new URLSearchParams({
          userid: "1000596100",
          orgid: "614",
          patientid: patientData.userid || "",
          fname: patientData.fname || "",
          lname: patientData.lname || "",
          mname: patientData.mname || "",
          age: patientData.age || "",
          agetype: patientData.agetype || "Years",
          countrycode: patientData.countrycode || "977",
          mobileno: patientData.mobileno || "",
          email: patientData.email || "",
          gender: patientData.gender || "",
          relationid: patientData.relationid || "",
          address: patientData.address || "",
          districtid: patientData.districtid || "",
          vdcid: patientData.vdcid || "",
          wardno: patientData.wardno || "",
          dateofbirth: patientData.dateofbirth || "",
          addtorelative: "Y",
        }).toString(),
      }),
      invalidatesTags: ["Relatives"],
    }),

    deletePatient: builder.mutation<PatientListResponse, { patientId: string }>(
      {
        query: ({ patientId }) => ({
          url: "user/deleterelative",
          method: "POST",
          body: new URLSearchParams({
            patientId,
          }).toString(),
        }),
        invalidatesTags: ["Relatives"],
      }
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetPatientListQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;
