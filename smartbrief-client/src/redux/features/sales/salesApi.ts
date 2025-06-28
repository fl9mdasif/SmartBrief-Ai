import { TOrder, TSales } from "../../../types/sales.types";
import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    salesHistory: builder.query<
      TSales,
      {
        daily: string;
        weekly: string;
        monthly: string;
        yearly: string;
      }
    >({
      query: (options) => ({
        url: "/sales/sales-history", // Adjust the endpoint URL as needed
        method: "GET",
        params: options,
        // params: { brand: "n" },
      }),
    }),
  }),
});

// create order
const createOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<TOrder[], void>({
      query: (orderData) => ({
        url: "/sales",
        method: "POST",
        body: orderData,
      }),
    }),
  }),
});

export const { useSalesHistoryQuery } = productApi;
export const { useCreateOrderMutation } = createOrderApi;
