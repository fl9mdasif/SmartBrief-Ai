/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPolish, TResponseRedux } from "../../../types/global";
import { baseApi } from "../../api/baseApi";

const createProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShoePolish: builder.mutation<TPolish[], void>({
      query: (data) => ({
        url: "/shoePolish",
        method: "POST",
        body: data,
      }),
    }),
    // Update polish status
    updatePolishStatus: builder.mutation<
      any,
      { polishId: string; updatedData: any }
    >({
      query: ({ polishId, updatedData }) => ({
        url: `/shoePolish/${polishId}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    getMyPolishReq: builder.query({
      query: () => {
        return {
          url: `/shoePolish`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<any>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),
  }),
});

export const {
  useCreateShoePolishMutation,
  useGetMyPolishReqQuery,
  useUpdatePolishStatusMutation,
} = createProductApi;
