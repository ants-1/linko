import { apiSlice } from "./apiSlice";
const COUNTRY_URL = "/api/v1/countries";

export const CountryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCountries: builder.query({
      query: () => ({
        url: `${COUNTRY_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchCountriesQuery } = CountryApiSlice;

