import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import { clearUser } from "../reducers/authReducer";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/`,
    credentials: "include",
  }),
  tagTypes: ["Chat", "User", "Message"],

  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: (name) => ({
        url: "chat/verified/allChats",
        params: { name },
      }),
      providesTags: ["Chat"],
    }),

    searchNonFriends: builder.query({
      query: (name) => ({
        url: "user/verified/notFriendSearch",
        params: { name },
      }),
      providesTags: ["User"],
    }),

    requestFriend: builder.mutation({
      query: (data) => ({
        url: "user/verified/sendFriendRequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    fetchNotifications: builder.query({
      query: () => "user/verified/notifications",
      keepUnusedDataFor: 0,
    }),

    acceptFriend: builder.mutation({
      query: (data) => ({
        url: "user/verified/acceptFriendRequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    fetchChatDetails: builder.query({
      query: (chatId) => ({
        url: `chat/verified/${chatId}`,
      }),
      providesTags: ["Chat"],
    }),

    fetchMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/verified/messages/${chatId}?page=${page}`,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Message"],
    }),

    uploadAttachment: builder.mutation({
      query: (data) => ({
        url: "chat/verified/attachments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    fetchFriends: builder.query({
      query: (chatId) => {
        let url = `user/verified/friends`;
        if (chatId) url += `?chatId=${chatId}`;
        return { url };
      },
      providesTags: ["Chat"],
    }),

    createGroup: builder.mutation({
      query: (formData) => ({
        url: "chat/verified/newGroup",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Chat"],
    }),

    fetchGroups: builder.query({
      query: () => ({
        url: "chat/verified/allGroups",
      }),
      providesTags: ["Chat"],
    }),

    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/verified/${chatId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),

    changeGroupAvatar: builder.mutation({
      query: ({ chatId, formData }) => ({
        url: `chat/verified/${chatId}/changeAvatar`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Chat"],
    }),

    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `chat/verified/removeMember`,
        method: "DELETE",
        body: { chatId, userId },
      }),
      invalidatesTags: ["Chat", "Message"],
    }),

    addGroupMembers: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chat/verified/addNewMembers`,
        method: "PUT",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chat", "Message"],
    }),

    deleteChatOrGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/verified/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    exitGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/verified/leaveGroup/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    logoutUser: builder.mutation({
      query: (dispatch) => {
        dispatch(clearUser());
        return {
          url: `user/verified/logOut`,
          method: "POST",
        };
      },
      invalidatesTags: ["Chat"],
    }),

    editProfile: builder.mutation({
      query: (formData) => ({
        url: `user/verified/editProfile`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export default api;

export const {
  useFetchChatsQuery,
  useLazySearchNonFriendsQuery,
  useRequestFriendMutation,
  useFetchNotificationsQuery,
  useAcceptFriendMutation,
  useFetchChatDetailsQuery,
  useFetchMessagesQuery,
  useUploadAttachmentMutation,
  useFetchFriendsQuery,
  useCreateGroupMutation,
  useFetchGroupsQuery,
  useRenameGroupMutation,
  useChangeGroupAvatarMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMembersMutation,
  useDeleteChatOrGroupMutation,
  useExitGroupMutation,
  useClearChatFromRtkMutation,
  useLogoutUserMutation,
  useEditProfileMutation,
} = api;
