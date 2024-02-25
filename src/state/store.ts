import { configureStore } from "@reduxjs/toolkit";
import typeFileReducer from "./file/open";

export const store = configureStore({
  reducer: {
    type_file: typeFileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
