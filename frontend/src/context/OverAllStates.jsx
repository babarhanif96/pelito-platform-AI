import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constant";
import StatesContext from "./StatesContext";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OverAllStates = (props) => {
    let user = ''

    const loggedInTime = localStorage.getItem('LoggedInTime')
    const authUserString = localStorage.getItem('authUser')

    if (loggedInTime && authUserString) {
        const currentDate = new Date().getTime()
        if ((loggedInTime + 172800000) > currentDate) {
            user = JSON.parse(authUserString)
        } else {
            localStorage.removeItem('LoggedInTime')
            localStorage.removeItem('authUser')
        }
    }

    const defaultStates = {
        success: '',
        error: '',
        loader: '',
        user,
        onBoardUrl: ''
    };

    const [state, setstate] = useState(defaultStates);
    const [isUpdated, setisUpdated] = useState(false);

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const handleStateChange = (value) => {
        setstate((prev) => ({
            ...prev,
            ...value,
        }));
    };




    const handleLogout = async () => {

        navigate('/login')
        handleStateChange({
            user: '',
            OnBoardUrl: ''
        })
        localStorage.removeItem('LoggedInTime')
        localStorage.removeItem('authUser')
        localStorage.removeItem('token')
        queryClient.clear()

    }

    const handleonBoard = async () => {

        try {
            await axios
                .get(BACKEND_URL + "/user/boarding-link/" + state.user._id, {
                    headers: {
                        //"Content-Type": "multipart/form-data",
                        // Add any other necessary headers
                    },
                })
                .then(function (response1) {
                    if (response1.data.boarding_url) {
                        handleStateChange({ onBoardUrl: response1.data.boarding_url })
                    } else {
                        handleStateChange({ onBoardUrl: 'Connected' })
                    }
                })

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {

        if (state.user && state.user._id) {
            handleonBoard()
        }

    }, [state.user])



    return (
        <StatesContext.Provider
            value={{
                state,
                handleStateChange,
                setisUpdated,
                handleLogout,

            }}>
            {props.children}
        </StatesContext.Provider>
    );
};

export default OverAllStates;
