import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSummaryId: null,
  selectedSummaryDetails: null,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSelectedSummary: (state, action) => {
      if (action.payload) {
        state.selectedSummaryId = action.payload._id;
        state.selectedSummaryDetails = action.payload;
      } else {
        // This is for creating a new summary
        state.selectedSummaryId = 'new';
        state.selectedSummaryDetails = null;
      }
    },
    clearSelectedSummary: (state) => {
        state.selectedSummaryId = null;
        state.selectedSummaryDetails = null;
    }
  },
});

export const { setSelectedSummary, clearSelectedSummary } = summarySlice.actions;

export default summarySlice.reducer;