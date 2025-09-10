import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeFilter: "",
  isRegisterModalOpen: false,
  loggedInStatus: false, // new field
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
    },
    updateLoggedInStatus: (state, action) => {
      state.loggedInStatus = action.payload; // true / false
    },
  },
});

export const {
  updateActiveFilter,
  openRegisterModal,
  closeRegisterModal,
  updateLoggedInStatus,
} = dataSlice.actions;

// Optional selectors
export const selectActiveFilter = (state) => state.data.activeFilter;
export const selectIsRegisterModalOpen = (state) =>
  state.data.isRegisterModalOpen;
export const selectLoggedInStatus = (state) => state.data.loggedInStatus;

export default dataSlice.reducer;
