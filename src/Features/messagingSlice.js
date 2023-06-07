import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import filterMessage from "../Utils/filterMessage";

const initialState = {
    conversations : [],
    messages : [],
    selectedConv: null,
    messageModalOpen: false,
    messageSent: false,
    isLoading: false,
}

export const getConversations = createAsyncThunk('messaging/getConversations', async () => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch (`http://127.0.0.1:8000/getConversations/`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`,
        },
    })
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const newConversation = createAsyncThunk('messaging/newConversation', async ({recipient, newMessage}) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch (`http://127.0.0.1:8000/newConversation/${recipient}`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`,
        },
        body: JSON.stringify({newMessage})
    })
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const getMessages = createAsyncThunk('messaging/getMessages', async (_,thunkApi) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const selectedConv = thunkApi.getState().messaging.selectedConv
    const response = await fetch (`http://127.0.0.1:8000/getMessages/${selectedConv}`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`,
        },
    })
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

const messagingSlice = createSlice({
    name : 'messaging',
    initialState,
    reducers : {
        setSelectedConv : (state, action) => {
            state.selectedConv = action.payload
        },
        setMessageModalOpen: (state, action) => {
            state.messageModalOpen = action.payload
        },
    },
    extraReducers: {
        [newConversation.pending]: (state) => {
            state.isLoading = true
        },
        [newConversation.fulfilled]: (state) => {
            state.messageSent = true
            state.isLoading = false
        },
        [newConversation.rejected]: (state, action) => {
            alert(action.error.message)
            state.messageSent = false
            state.isLoading = false
        },
        [getConversations.pending]: (state) => {
            state.isLoading = true
        },
        [getConversations.fulfilled]: (state, action) => {
            state.conversations = action.payload
            state.isLoading = false
        },
        [getConversations.rejected]: (state, action) => {
            alert(action.error.message)
            state.isLoading = false
        },
        [getMessages.pending]: (state) => {
            state.isLoading = true
        },
        [getMessages.fulfilled]: (state, action) => {
            state.messages = action.payload
            state.scrollMessages = true
            state.isLoading = false
        },
        [getMessages.rejected]: (state, action) => {
            alert(action.error.message)
            state.isLoading = false
        },
    }
})

export const {setSelectedConv, setMessageModalOpen} = messagingSlice.actions
export default messagingSlice.reducer