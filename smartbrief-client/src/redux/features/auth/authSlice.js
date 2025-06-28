import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // This action is for the initial login
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    // This is a new, specific action just for credits
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// Export the new action
export const { setUser, logout, updateCredits } = authSlice.actions;

export default authSlice.reducer;
// Selectors
export const useCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
