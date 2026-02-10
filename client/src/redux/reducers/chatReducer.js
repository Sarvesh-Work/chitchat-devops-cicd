import { createSlice } from "@reduxjs/toolkit";
import { NEW_MESSAGE_ALERT } from "../../constants/events";
import { getOrSaveFromStorage } from "../../lib/features";

const initialState = {
  notificationCount:
    getOrSaveFromStorage({
      key: "notifications",
      get: true,
    }) || 0,
  newMessageAlerts:
    getOrSaveFromStorage({
      key: NEW_MESSAGE_ALERT,
      get: true,
    }) || [],
  userTyping: null,
  updateLastMessage: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    reSetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      const { chatId } = action.payload;

      const index = state.newMessageAlerts.findIndex(
        (item) => item.chatId === chatId
      );

      if (index !== -1) {
        state.newMessageAlerts[index].count += 1;
      } else {
        state.newMessageAlerts.push({
          chatId,
          count: 1,
        });
      }
    },
    reSetNewMessageAlert: (state, action) => {
      state.newMessageAlerts = state.newMessageAlerts.filter(
        (item) => item.chatId !== action.payload
      );
    },
    setUserTyping: (state, action) => {
      const { chatId } = action.payload;
      state.userTyping = chatId;
    },
    resetUserTyping: (state) => {
      state.userTyping = null;
    },
    setUpdateLastMessage: (state, action) => {
      const { chatId, message, time } = action.payload;

      const index = state.updateLastMessage.findIndex(
        (item) => item.chatId === chatId
      );

      if (index !== -1) {
        state.updateLastMessage[index].message = message;
        state.updateLastMessage[index].time = time;
      } else {
        state.updateLastMessage.push({
          chatId,
          message,
          time,
        });
      }
    },
  },
});

export const {
  setNotificationCount,
  reSetNotificationCount,
  setNewMessagesAlert,
  reSetNewMessageAlert,
  setUserTyping,
  resetUserTyping,
  setUpdateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
