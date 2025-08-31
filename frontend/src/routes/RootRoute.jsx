import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StatesContext from '../context/StatesContext';

const RootRoute = () => {

    const context = useContext(StatesContext);
    const { state } = context;

    if (state.user) {
        if (state.user.user_type === 'admin') {
            return <Outlet />;
        } else {
            if (state.user.user_type === 'professional') {
                return <Navigate to="/professional/news-feed" />
            } else {
                return <Navigate to="/dashboard" />
            }
        }
    } else {
        return <Navigate to="/" />;
    }
};

export default RootRoute;
