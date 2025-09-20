import { createSlice } from "@reduxjs/toolkit";

interface SpinnerState {
  loading: boolean;
}

const initialState: SpinnerState = {
  loading: false,
};

const spinnerManageSlice = createSlice({
  name: "spinnerManage",
  initialState,
  reducers: {
    showSpinner: (state) => {
      state.loading = true;
    },
    hideSpinner: (state) => {
      state.loading = false;
    },
  },
});

export const { showSpinner, hideSpinner } = spinnerManageSlice.actions;

export default spinnerManageSlice.reducer;
