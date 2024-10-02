import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface Product {
    id: number;
    title: string;
    photo: string;
    price: number;
}

interface ProductState {
    items: Product[];
    isLoaded: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Async action to fetch products
export const fetchProducts = createAsyncThunk<Product[], void>(
    'products/fetchProducts',
    async (_, {rejectWithValue}) => {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
            return rejectWithValue('Error loading products');
        }
        return await response.json();
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        isLoaded: false,
        status: 'idle',
        error: null,
    } as ProductState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload.map((product) => ({
                    ...product,
                    id: parseInt(product.id.toString()), // Parse ID as number
                }));
                state.isLoaded = true;
                state.status = 'succeeded';
                localStorage.setItem('products', JSON.stringify(action.payload));
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string; // Cast payload to string
            });
    },
});

// Export actions and selectors
export const selectProducts = (state: { products: ProductState }) => state.products.items;
export const selectProductStatus = (state: { products: ProductState }) => state.products.status;
export const selectProductError = (state: { products: ProductState }) => state.products.error;

export default productSlice.reducer;