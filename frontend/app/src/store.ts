import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

export type RootState = {
    user: ReturnType<typeof userReducer>;
    products: ReturnType<typeof productReducer>;
    cart: ReturnType<typeof cartReducer>;
    orders: ReturnType<typeof orderReducer>;
};

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        user: userReducer,
        products: productReducer,
        cart: cartReducer,
        orders: orderReducer,
    },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;