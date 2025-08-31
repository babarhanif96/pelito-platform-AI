import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StatesContext from '../context/StatesContext';

const ProfRoute = () => {
    const context = useContext(StatesContext);
    const { state } = context;

    if (state.user) {

        if (state.user.user_type === 'professional') {
            return <Outlet />
        } else {
            if (state.user.user_type === 'admin') {
                return <Navigate to="/admin/news-feed" />
            } else {

                return <Navigate to="/dashboard" />
            }
        }

    } else {
        return <Navigate to="/" />;
    }
};

export default ProfRoute;
