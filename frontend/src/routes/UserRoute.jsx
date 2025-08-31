import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StatesContext from '../context/StatesContext';

const UserRoute = () => {
    const context = useContext(StatesContext);
    const { state } = context;

    if (state.user) {

        if (state.user.user_type === 'admin') {
            return <Navigate to="/admin/news-feed" />
        }

        if (state.user.user_type === 'professional') {
            return <Navigate to="/professional/news-feed" />
        } else {
            return <Outlet />
        }

    } else {
        return <Navigate to="/" />;
    }
};

export default UserRoute;
