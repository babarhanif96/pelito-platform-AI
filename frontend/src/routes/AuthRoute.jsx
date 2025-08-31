import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StatesContext from '../context/StatesContext';

const AuthRoute = () => {
    const context = useContext(StatesContext);
    const { state } = context;

    if (!state.user) {
        return <Outlet />;
    } else {


        if (state.user.user_type === 'professional') {
            return <Navigate to="/professional/news-feed" />
        }
        if (state.user.user_type === 'admin') {
            return <Navigate to="/admin/news-feed" />
        } else {

            return <Navigate to="/dashboard" />
        }



    }
};

export default AuthRoute;
