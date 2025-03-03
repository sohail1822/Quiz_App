import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  severity: "success",
  show: false,
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.show = true;
    },
    hideSnackbar: (state) => {
      state.show = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
