import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.mero.doctor/api/v3/",
    prepareHeaders: (headers, { endpoint, getState }) => {
      headers.set("Apiversion", "v3");
      headers.set("Appversion", "0.0.30-DEBUG");
      headers.set("Appversioncode", "56");
      headers.set("Orgid", "614");
      headers.set("Apikey", "de3f1c39f8c03a3401303fdeb9748668");
      headers.set("Content-Type", "application/x-www-form-urlencoded");

      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      if (!text || text.trim() === "") {
        return { success: false, data: [], message: "Empty response" };
      }
      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (error) {
        console.error("JSON Parse Error:", error);
        return { success: false, data: [], message: "Invalid response format" };
      }
    },
  }),
  tagTypes: ["Patient", "Relatives"],
  endpoints: () => ({}),
});
