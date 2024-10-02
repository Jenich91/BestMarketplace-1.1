import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface CartItem {
    productId: number;
    quantity: number;
}

interface CartState {
    items: Record<number, number>;
}

// Fetch cart items
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async ({userId}: { userId: string }, {rejectWithValue}) => {
        const response = await fetch(`http://localhost:5000/cart/${userId}`);
        if (!response.ok) {
            return rejectWithValue('Error loading cart or cart empty');
        }
        return await response.json();
    }
);

// Add item to cart
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({userId, productId, quantity}: {
        userId: string;
        productId: number;
        quantity: number
    }, {rejectWithValue}) => {
        const response = await fetch('http://localhost:5000/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId, productId, quantity}),
        });

        if (!response.ok) {
            return rejectWithValue('Error adding item to cart');
        }

        return {productId, quantity};
    }
);

// Remove item from cart
export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async ({userId, productId}: { userId: string; productId: number }, {rejectWithValue}) => {
        const response = await fetch(`http://localhost:5000/cart/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId}),
        });

        if (!response.ok) {
            return rejectWithValue('Error removing item from cart');
        }

        return productId;
    }
);

// Update item quantity in cart
export const updateQuantityAsync = createAsyncThunk(
    'cart/updateQuantity',
    async ({userId, productId, quantity}: {
        userId: string;
        productId: number;
        quantity: number
    }, {rejectWithValue}) => {
        if (quantity === 0) {
            const response = await fetch(`http://localhost:5000/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId}),
            });

            if (!response.ok) {
                return rejectWithValue('Error removing item from cart');
            }

            return productId;
        } else {
            const response = await fetch('http://localhost:5000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId, productId, quantity}),
            });

            if (!response.ok) {
                return rejectWithValue('Error updating item quantity in cart');
            }

            return {productId, quantity};
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState:
        {items: {}} as CartState,

    reducers: {
        clearCart(state) {
            state.items = {};
            localStorage.removeItem('cart');
        },

        loadCartFromLocalStorage(state) {
            const cachedCart = localStorage.getItem('cart');

            if (cachedCart) {
                state.items = JSON.parse(cachedCart);
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.items = {};
            action.payload.forEach((item: CartItem) => {
                state.items[item.productId] = item.quantity;
            });
            localStorage.setItem('cart', JSON.stringify(state.items));
        })

            .addCase(addToCartAsync.fulfilled, (state, action) => {
                const {productId, quantity} = action.payload;
                state.items[productId] = (state.items[productId] || 0) + quantity;
                localStorage.setItem('cart', JSON.stringify(state.items));
            })

            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                delete state.items[action.payload];
                localStorage.setItem('cart', JSON.stringify(state.items));
            })

            .addCase(updateQuantityAsync.fulfilled, (state, action) => {
                const {productId, quantity} = action.payload;
                if (quantity > 0) {
                    state.items[productId] = quantity;
                } else {
                    delete state.items[productId];
                }
                localStorage.setItem('cart', JSON.stringify(state.items));
            })

            .addCase(fetchCart.rejected, (state, action) => {
                console.error(action.payload);
            })

            .addCase(addToCartAsync.rejected, (state, action) => {
                console.error(action.payload);
            })

            .addCase(removeFromCartAsync.rejected, (state, action) => {
                console.error(action.payload);
            })

            .addCase(updateQuantityAsync.rejected, (state, action) => {
                console.error(action.payload);
            });
    },
});

// Export reducer and actions.
export default cartSlice.reducer;

// Selector for getting items in the cart.
export const {clearCart, loadCartFromLocalStorage} = cartSlice.actions;

export const selectCartItems = (state: { cart: { items: {} } }) => state.cart.items;
