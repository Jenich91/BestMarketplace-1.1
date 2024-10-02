import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ProtectedRoute from "./ProtectedRoute";
import MainPage from "./MainPage";
import CartPage from "./CartPage";
import ProductDetails from "./ProductDetails";
import MyOrdersPage from "./MyOrdersPage";

export const isSafari = () => {
    const userAgent = navigator.userAgent;
    return /^((?!chrome|android).)*safari/i.test(userAgent);
};

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/products/:productId" element={<ProductDetails/>}/>
            <Route path="/cart" element={<ProtectedRoute><CartPage/></ProtectedRoute>}/>
            <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
};

export default App;