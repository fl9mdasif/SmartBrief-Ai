/* eslint-disable @typescript-eslint/no-explicit-any */
import { TQueryParam, TResponseRedux } from "../../../types/global";
import { TProduct } from "../../../types/product.types";
import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/shoes",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<TProduct[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),
  }),
});

const createProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<TProduct[], void>({
      query: (shoesData) => ({
        url: "/shoes/create-shoes",
        method: "POST",
        body: shoesData,
      }),
    }),
    updateProduct: builder.mutation<
      TProduct,
      { shoeId: string; updatedData: TProduct }
    >({
      query: ({ shoeId, updatedData }) => ({
        url: `/shoes/${shoeId}`, // Replace with your actual update endpoint
        method: "PUT",
        body: updatedData,
      }),
    }),
    deleteProducts: builder.mutation<ResponseType, string[]>({
      query: (ids) => ({
        url: `/shoes/shoeIds`,
        method: "DELETE",
        body: ids,
      }),
    }),
    verifyProduct: builder.query<any, string>({
      query: (id) => {
        return {
          url: `/shoes/verify/${id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAllProductsQuery } = productApi;
export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductsMutation,
  useVerifyProductQuery,
} = createProductApi;
