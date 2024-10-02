import React, {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectUser} from "./slices/userSlice";

interface ProtectedRouteProps {
    children: ReactNode; // Supports any child elements
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const user = useSelector(selectUser);

    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>; // Return children wrapped in a fragment
};

export default ProtectedRoute;