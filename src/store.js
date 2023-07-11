import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./Features/postSlice";
import userReducer from "./Features/userSlice";
import messagingReducer from "./Features/messagingSlice"

export const store = configureStore({
    reducer: {
        post : postReducer,
        user : userReducer,
        messaging : messagingReducer,
    },
})