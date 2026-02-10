import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import uiReducer from "./reducers/uiReducer";
import api from "./apis/apiRtk";
import chatReducer from "./reducers/chatReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
