import { configureStore } from "@reduxjs/toolkit";
// Correct the paths here:
import authReducer from "../redux/features/auth/authSlice";
import summaryReducer from "./features/summary/summarySlice"; // Ensure this path is correct
import { baseApi } from "./api/baseApi"; // This path likely needs correction too
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "auth", // It's better to persist only the auth slice
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer, // Use the persisted reducer
     summary: summaryReducer, // <-- Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);