import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import snackbarReducer from "./snackbarSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackbarReducer,
  },
});

export default store;
