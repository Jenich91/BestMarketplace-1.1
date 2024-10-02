import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface Order {
    id: number;
}

interface OrderState {
    items: Order[];
}

// Fetch orders for a user
export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async ({userId}: { userId: string }) => {
        const response = await fetch(`http://localhost:${5000}/my-orders?userId=${userId}`);
        if (!response.ok) throw new Error("Error loading orders");
        return await response.json();
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
    } as OrderState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    },
});

// Export reducer and selectors
export default orderSlice.reducer;
export const selectOrders = (state: { orders: OrderState }) => state.orders.items;