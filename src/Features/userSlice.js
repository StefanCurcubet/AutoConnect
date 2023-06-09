import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import filterMessage from "../Utils/filterMessage";

const initialState = {
    userInfo : null,
    favouritedPosts: '',
    isLogged : false,
    settings: {},
    settingsModalOpen : false,
    deleteModalOpen: false,
    pinId : null,
    pinCorrect: false,
    isLoading : false,
}

export const createUser = createAsyncThunk('user/createUser', async ({username, password, email}) => {
    const response = await fetch('http://127.0.0.1:8000/newUser/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'username': username, 'password': password, 'email': email}),
    });
    if (response.status === 200) {
        alert('Account created')
    }
    if (response.status === 500) {
        alert('User already exists');
    }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async () => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch('http://127.0.0.1:8000/deleteUser/', {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`,
        }
    })
    if (response.status === 200) {
        return response.json();
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)));
    }
})

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

export const getSettings = createAsyncThunk('user/getSettings', async () => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch(`http://127.0.0.1:8000/getSettings`, {
        method: 'GET',
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

export const updateSettings = createAsyncThunk('user/updateSettings', async (modifiedSettings) => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch(`http://127.0.0.1:8000/updateSettings`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`, 
        },
        body: JSON.stringify(modifiedSettings)
    })
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
})

export const createPin = createAsyncThunk('user/createPin', async () => {
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const response = await fetch('http://127.0.0.1:8000/createPin/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
    });
    if (response.status === 200) {
        return response.json()
    } else {
        const data = await response.json()
        throw new Error(filterMessage(JSON.stringify(data)))
    }
});

export const verifyPin = createAsyncThunk('user/verifyPin', async(pin, thunkAPI) => {
    console.log('trying to verufy');
    const {access} = JSON.parse(localStorage.getItem('authTokens'))
    const pinId = thunkAPI.getState().user.pinId
    console.log(pinId);
    const response = await fetch(`http://127.0.0.1:8000/verifyPin/${pinId}`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${access}`, 
        },
        body: JSON.stringify(pin)
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
        },
        setSettingsModal: (state, action) => {
            state.settingsModalOpen = action.payload
        },
        setDeleteModal: (state, action) => {
            state.deleteModalOpen = action.payload
        },
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
            alert(action.error.message + 'from tokens')
            userSlice.caseReducers.logout(state)
            state.isLoading = false
        },
        [toggleFavourite.pending]: (state) => {
            state.isLoading = true
        },
        [toggleFavourite.fulfilled]: (state) => {
            state.isLoading = false
        },
        [toggleFavourite.rejected]: (state) => {
            userSlice.caseReducers.logout(state)
            state.isLoading = false
        },
        [getFavourites.pending]: (state) => {
            state.isLoading = true
        },
        [getFavourites.fulfilled]: (state, action) => {
            state.favouritedPosts = action.payload.favourited_posts
            state.isLoading = false
        },
        [getFavourites.rejected]: (state) => {
            userSlice.caseReducers.logout(state)
            state.isLoading = false
        },
        [getSettings.pending]: (state) => {
            state.isLoading = true
        },
        [getSettings.fulfilled]: (state, action) => {
            state.settings = action.payload
            state.isLoading = false
        },
        [getSettings.rejected]: (state, action) => {
            alert(action.payload)
            state.isLoading = false
        },
        [updateSettings.pending]: (state) => {
            state.isLoading = true
        },
        [updateSettings.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [updateSettings.rejected]: (state, action) => {
            alert(action.payload)
            state.isLoading = false
        },
        [createPin.pending]: (state) => {
            state.isLoading = true
        },
        [createPin.fulfilled]: (state, action) => {
            state.pinId = action.payload
            state.pinCorrect = false
            state.isLoading = false
        },
        [createPin.rejected]: (state, action) => {
            alert(action.payload)
            state.isLoading = false
        },
        [verifyPin.pending]: (state) => {
            state.isLoading = true
        },
        [verifyPin.fulfilled]: (state, action) => {
            if (action.payload) {
                console.log(action.payload);
                state.pinCorrect = true
            } else {
                alert('PIN incorrect')
                state.pinCorrect = false
            }
            state.isLoading = false
        },
        [verifyPin.rejected]: (state, action) => {
            alert('Unable to verify')
            state.isLoading = false
        },
        [deleteUser.pending]: (state) => {
            state.isLoading = true
        },
        [deleteUser.fulfilled]: (state) => {
            userSlice.caseReducers.logout(state)
            state.deleteModalOpen = false
            alert('Account deleted')
            state.isLoading = false
        },
        [deleteUser.rejected]: (state, action) => {
            alert(action.payload)
            state.isLoading = false
        },
    }
})

export const {logout, getLocalTokens, setSettingsModal, setDeleteModal} = userSlice.actions
export default userSlice.reducer