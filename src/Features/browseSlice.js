import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import filterMessage from "../Utils/filterMessage";

const initialState = {
    allPosts : [],
    orderby : '-added',
    filter : {
        make: "",
        registration_from: "",
        registration_until: "",
        price_from: "",
        price_until: "",
        mileage_from: "",
        mileage_until: "",
    },
    deleteModal: {
        open: false,
        selectedPost : '',
    },
    isLoading : true
}


export const getAllPosts = createAsyncThunk('browse/getAllPosts', (_, thunkAPI) => {
    const orderby = thunkAPI.getState().browse.orderby
    return fetch(`http://127.0.0.1:8000/getAllPosts/${orderby}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
})

export const ratePost = createAsyncThunk('browse/ratePost', async ({id, rating}) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch (`http://127.0.0.1:8000/rateListing/${id}/${rating}`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`,
        }
    })
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const deletePost = createAsyncThunk(`browse/deletePost/`, async (_,thunkAPI) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const {selectedPost} = thunkAPI.getState().browse.deleteModal
    const response = await fetch (`http://127.0.0.1:8000/deleteListing/${selectedPost}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`,
        }
    })
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

const browseSlice = createSlice({
    name : 'browse',
    initialState,
    reducers: {
        setOrderby: (state, action) => {
            state.orderby = action.payload
        },
        setFilter: (state, action) => {
            const {name, value} = action.payload
            state.filter = {...state.filter, [name] : value}
        },
        clearFilters: (state) => {
            state.filter = initialState.filter
        },
        selectPost: (state, action) => {
            console.log(action.payload);
            state.selectedPostId = action.payload
        },
        setDeleteModalOpen: (state, action) => {
            state.deleteModal.open = action.payload
        },
        setDeletePost: (state,action) => {
            state.deleteModal.selectedPost = action.payload
        }
    },
    extraReducers:{
        [getAllPosts.pending]: (state) =>{
            state.isLoading = true
        },
        [getAllPosts.fulfilled]: (state, action) =>{
            state.isLoading = false
            state.allPosts = action.payload
        },
        [getAllPosts.rejected]: (state) =>{
            state.isLoading = false
        },
        [deletePost.pending]: (state) =>{
            state.isLoading = true
        },
        [deletePost.fulfilled]: (state, action) =>{
            state.isLoading = false
            state.deleteModal.open = false
        },
        [deletePost.rejected]: (state) =>{
            state.isLoading = false
        }
    }
})

export const {setOrderby, setFilter, clearFilters, selectPost, setDeleteModalOpen, setDeletePost} = browseSlice.actions
export default browseSlice.reducer