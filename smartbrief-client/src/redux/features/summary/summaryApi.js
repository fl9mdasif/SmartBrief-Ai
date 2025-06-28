/* eslint-disable no-unused-vars */
import { baseApi } from '../../api/baseApi';
import { setUser, updateCredits } from '../auth/authSlice';

export const summaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
 
    getSummaries: builder.query({
      query: () => '/summaries',
      // Provides a 'Summaries' tag to the cached data.
      // This allows us to automatically refetch this data later.
      providesTags: ['Summaries'],
    }),

    createSummary: builder.mutation({
      query: (summaryData) => ({
        url: '/summaries',
        method: 'POST',
        body: summaryData,
      }),
      // This block is now corrected
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { updatedCredits } = data.data;

          if (updatedCredits !== undefined) {
            // Dispatch the NEW, specific action with only the credit number
            dispatch(updateCredits(updatedCredits));
          }
        } catch (error) {
          console.error('Failed to update credits after creation:', error);
        }
      },
      invalidatesTags: ['Summaries'],
    }),

    // ...updateSummary and deleteSummary mutations...
    // IMPORTANT: You must also make the same change in your updateSummary mutation!
    updateSummary: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/summaries/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.updatedCredits !== undefined) {
             // Use the same, correct action here too
            dispatch(updateCredits(data.data.updatedCredits));
          }
        } catch (error) {
            console.log('Update did not affect credits, which is normal for manual edits.');
        }
      },
      invalidatesTags: ['Summaries'],
    }),

      // 4. DELETE /summaries/:id: Deletes a summary
    deleteSummary: builder.mutation({
      query: (id) => ({
        url: `/summaries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Summaries'],
    }),

    // We can leave a placeholder for re-prompting for a future feature
     // RENAMED and UPDATED for clarity
    manualEditSummary: builder.mutation({
      query: ({ id, summarizedContent }) => ({
        url: `/summaries/${id}/manual-edit`, // Calls the new backend route
        method: 'PATCH',
        body: { summarizedContent }, // Sends the correct body
      }),
      invalidatesTags: ['Summaries'],
    }),
    // This is the only update/patch function we need now
    rePromptSummary: builder.mutation({
      query: ({ id, prompt }) => ({
        url: `/summaries/${id}/re-prompt`,
        method: 'PATCH',
        body: { prompt },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.updatedCredits !== undefined) {
            dispatch(updateCredits(data.data.updatedCredits));
          }
        } catch (error) {
          console.log('Error during re-prompt credit update.');
        }
      },
      // Keep this! It's important for updating the sidebar.
      invalidatesTags: ['Summaries'], 
    }),
  }),

  
});

  
 

// Export the auto-generated hooks for use in your components
export const {
  useGetSummariesQuery,
  useCreateSummaryMutation,
  useUpdateSummaryMutation,
  useDeleteSummaryMutation,
  useManualEditSummaryMutation,
  useRePromptSummaryMutation,
} = summaryApi;