import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import filterMessage from "../Utils/filterMessage";

const initialState = {
    allPosts : [],
    allSellerRatings:[],
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


export const getAllPosts = createAsyncThunk('post/getAllPosts', (_, thunkAPI) => {
    const orderby = thunkAPI.getState().post.orderby
    return fetch(`http://127.0.0.1:8000/getAllPosts/${orderby}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
})

export const ratePost = createAsyncThunk('post/ratePost', async ({id, rating}) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch (`http://127.0.0.1:8000/ratePost/${id}/${rating}`, {
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

export const getAllSellerRatings = createAsyncThunk('post/getAllSellerRatings', async() => {
    const response = await fetch('http://127.0.0.1:8000/getAllSellerRatings/')
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const getSellerRating = createAsyncThunk('post/getSellerRating', async(username) => {
    const response = await fetch(`http://127.0.0.1:8000/getSellerRating/${username}`)
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const deletePost = createAsyncThunk(`post/deletePost/`, async (_,thunkAPI) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const {selectedPost} = thunkAPI.getState().post.deleteModal
    const response = await fetch (`http://127.0.0.1:8000/deletePost/${selectedPost}`, {
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

const postSlice = createSlice({
    name : 'post',
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
        },
        [getAllSellerRatings.pending]: (state) => {
            state.isLoading = true
        },
        [getAllSellerRatings.fulfilled]: (state, action) => {
            state.allSellerRatings = action.payload
            state.isLoading = false
        },
        [getAllSellerRatings.rejected]: (state) => {
            state.isLoading = false
        }
    }
})

export const {setOrderby, setFilter, clearFilters, selectPost, setDeleteModalOpen, setDeletePost} = postSlice.actions
export default postSlice.reducer