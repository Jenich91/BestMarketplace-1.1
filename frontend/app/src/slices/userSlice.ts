import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface UserData {
    id: number;
    name: string;
}

interface UserState {
    userData: UserData | null;
    isAuthenticated: boolean;
}

// Async action for user login
export const fetchLogin = createAsyncThunk(
    'user/login',
    async ({login, password}: { login: string; password: string }, {rejectWithValue}) => {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login, password}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message);
        }

        return await response.json();
    }
);

// Create user slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: (() => {
            const data = localStorage.getItem('userData');
            return data ? JSON.parse(data) : null;
        })(),
        isAuthenticated: !!localStorage.getItem('userData'),
    } as UserState,
    reducers: {
        logout(state) {
            state.userData = null;
            state.isAuthenticated = false;
            localStorage.removeItem('userData');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.userData = action.payload.userData;
                state.isAuthenticated = true;
                localStorage.setItem('userData', JSON.stringify(action.payload.userData));
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                console.error(action.payload);
                alert(action.payload);
            });
    },
});

// Export actions and selectors
export const {logout} = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user;

export default userSlice.reducer;