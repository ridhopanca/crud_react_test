import { lazy } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { globalStorage } from "./helpers";

const LoginPage = lazy(() => import('./pages/login'))
const DashboardPage = lazy(() => import('./pages/dashboard'))

const RequireAuth = ({children}) => {
    const { pathname } = useLocation();
    const token = Cookies.get("crud_access_token");
    const refreshToken = Cookies.get('crud_refresh_token');
    if(!token){
        return <Navigate to="/login" state={{ prev: pathname}}  />
    } 

    if(refreshToken){
        try {
            const tokens= Cookies.get('crud_access_token');
            const expires = (tokens.expires_in || 30 * 60) * 1000
            const inOneHour = new Date(new Date().getTime() + expires)
            Cookies.set('crud_access_token', tokens, { expires: inOneHour })
            Cookies.set('crud_refresh_token', 'refresh_token')
            return children;
        } catch(e){
            Cookies.remove('crud_access_token')
            globalStorage.removeItem('crud_user_data')
            Cookies.remove('crud_refresh_token')
            return <Navigate to="/login" state={{ prev: pathname}} />
        }
    }
    return children;
}

const Routes = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: (
                <RequireAuth>
                    <DashboardPage />
                </RequireAuth>
        )
    }
]);

export default Routes