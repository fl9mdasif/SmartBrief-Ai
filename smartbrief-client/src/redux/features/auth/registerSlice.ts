// import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../store";

// export type TUser = {
//   username: string;
//   role: string;
//   contactNumber: string;
//   email: string;
//   password: string;
// };
// type TRegAuthState = {
//   user: null | TUser;
// };

// const initialState: TRegAuthState = {
//   user: null,
// };

// const registerSlice = createSlice({
//   name: "register",
//   initialState,
//   reducers: {
//     regUser: (state, action) => {
//       const { user } = action.payload;
//       state.user = user;
//     },
//   },
// });

// export const { regUser } = registerSlice.actions;

// export default registerSlice.reducer;

// export const useCurrentToken = (state: RootState) => state.auth.token;
// export const selectCurrentUser = (state: RootState) => state.auth.user;
