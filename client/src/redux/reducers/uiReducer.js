import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCreatingNewGroup: false,
  isAddingMember: false,
  hasNotification: false,
  isMobileMenuOpen: false,
  isSearching: false,
  isFileMenuOpen: false,
  isUploading: false,
  isDeleteMenu: false,
  deleteChatSelection: {
    chatId: "",
    isGroupChat: false,
    name: "",
  },
  isProfileOpen: false,
  isMobileAndTabletHeaderMenuOpen: false,
  isDetailsOpen: false,
  openConformDelate: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCreatingNewGroup: (state, action) => {
      state.isCreatingNewGroup = action.payload;
    },
    setAddingMember: (state, action) => {
      state.isAddingMember = action.payload;
    },
    setHasNotification: (state, action) => {
      state.hasNotification = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
    setSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setFileMenuOpen: (state, action) => {
      state.isFileMenuOpen = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.isUploading = action.payload;
    },
    setDeleteChatSelection: (state, action) => {
      state.deleteChatSelection = action.payload;
    },
    setIsProfileOpen: (state, action) => {
      state.isProfileOpen = action.payload;
    },
    setIsMobileAndTabletHeaderMenuOpen: (state, action) => {
      state.isMobileAndTabletHeaderMenuOpen = action.payload;
    },
    setIsDetailsOpen: (state, action) => {
      state.isDetailsOpen = action.payload;
    },
    setOpenConformDelate: (state, action) => {
      state.openConformDelate = action.payload;
    },
  },
});

export const {
  setCreatingNewGroup,
  setAddingMember,
  setHasNotification,
  setMobileMenuOpen,
  setSearching,
  setFileMenuOpen,
  setUploadingLoader,
  setDeleteChatSelection,
  setIsDeleteMenu,
  setIsProfileOpen,
  setIsMobileAndTabletHeaderMenuOpen,
  setIsDetailsOpen,
  setOpenConformDelate,
} = uiSlice.actions;

export default uiSlice.reducer;
