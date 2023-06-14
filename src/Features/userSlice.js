import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import filterMessage from "../Utils/filterMessage";

const initialState = {
    userInfo : null,
    favouritedPosts: '',
    isLogged : false,
    isLoading : true,
}

export const createUser = createAsyncThunk('user/createUser', async ({username, password}) => {
    const response = await fetch('http://127.0.0.1:8000/newUser/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'username': username, 'password': password}),
    });
    if (response.status === 200) {
        alert('Account created')
    }
    if (response.status === 500) {
        alert('User already exists');
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async ({username, password}) => {
    const response = await fetch('http://127.0.0.1:8000/token/', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({'username': username, 'password': password})
    });
    if (response.status === 200) {
        return response.json();
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)));
    }
});

export const updateTokens = createAsyncThunk('user/updateTokens', async () => {
    const {refresh} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch('http://127.0.0.1:8000/token/refresh/', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({'refresh': refresh})
    })
    if (response.status === 200) {
       return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const toggleFavourite = createAsyncThunk('user/toggleFavourite', async (postId) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch (`http://127.0.0.1:8000/toggleFavourite/${postId}`, {
        method: 'POST',
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

export const getFavourites = createAsyncThunk('user/getFavourite', async () => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch (`http://127.0.0.1:8000/getFavourites/`, {
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


const userSlice = createSlice({
    name : 'userSlice',
    initialState,
    reducers : {
        logout: (state) => {
            state.userInfo = null
            state.favouritedPosts = ''
            localStorage.removeItem('authTokens')
            state.isLogged = false
        },
        getLocalTokens: (state, action) => {
            state.authTokens = action.payload
            state.userInfo = jwtDecode(action.payload.access)
            state.isLogged = true
        }
    },
    extraReducers : {
        [loginUser.pending]: (state) => {
            state.isLoading = true
        },
        [loginUser.fulfilled]: (state, action) => {
            state.authTokens = action.payload
            state.userInfo = jwtDecode(action.payload.access)
            localStorage.setItem('authTokens', JSON.stringify(action.payload))
            state.isLogged = true
            state.isLoading = false
        },
        [loginUser.rejected]: (state, action) => {
            alert(action.error.message)
            state.isLoading = false
        },
        [updateTokens.pending]: (state) => {
            state.isLoading = true
        },
        [updateTokens.fulfilled]: (state, action) => {
            state.authTokens = {...state.authTokens, access : action.payload.access}
            state.userInfo = jwtDecode(action.payload.access)
            localStorage.setItem('authTokens', JSON.stringify(state.authTokens))
            state.isLogged = true
            state.isLoading = false
        },
        [updateTokens.rejected]: (state, action) => {
            alert(action.error.message)
            userSlice.caseReducers.logout(state)
            state.isLoading = false
        },
        [toggleFavourite.pending]: (state) => {
            state.isLoading = true
        },
        [toggleFavourite.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [toggleFavourite.rejected]: (state, action) => {
            userSlice.caseReducers.logout(state)
            alert(action.error.message)
            state.isLoading = false
        },
        [getFavourites.pending]: (state) => {
            state.isLoading = true
        },
        [getFavourites.fulfilled]: (state, action) => {
            state.favouritedPosts = action.payload.favourited_posts
            state.isLoading = false
        },
        [getFavourites.rejected]: (state, action) => {
            alert(action.error.message)
            userSlice.caseReducers.logout(state)
            state.isLoading = false
        },
    }
})

export const {logout, getLocalTokens} = userSlice.actions
export default userSlice.reducer