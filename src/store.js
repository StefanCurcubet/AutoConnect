import { configureStore } from "@reduxjs/toolkit";
import browseReducer from "./Features/browseSlice";
import userReducer from "./Features/userSlice";

export const store = configureStore({
    reducer: {
        browse : browseReducer,
        user : userReducer
    },
})