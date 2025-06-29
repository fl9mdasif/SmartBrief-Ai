import { baseApi } from "../../../api/baseApi";

 

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all users
    getUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'], // Cache tag for the user list
    }),

    // Mutation to recharge credits
    rechargeCredits: builder.mutation({
      query: (rechargeData) => ({
        url: '/admin/users/recharge-credits',
        method: 'PATCH',
        body: rechargeData, // e.g., { userId: '...', amount: 50 }
      }),
      invalidatesTags: ['Users'], // Invalidate cache to refetch the user list automatically
    }),
  }),
});

export const { useGetUsersQuery, useRechargeCreditsMutation } = adminApi;