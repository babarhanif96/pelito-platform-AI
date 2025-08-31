import React, { useContext } from 'react'
import StatesContext from '../../context/StatesContext'
import { CircularProgress } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'

const DelAcc = () => {

    const context = useContext(StatesContext)
    const { state, handleLogout, handleStateChange } = context

    const mutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/user/del`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {
            let res = await data.json()
            if (res.success) {

                handleLogout()
                handleStateChange({ success: 'Account deleted successfully' })

            } else {
                handleStateChange({ error: res.message })
            }
        },
        onError(error) {
            console.log(error)
        }


    })

    const handleClick = async () => {

        handleStateChange({ loader: 'Deleting Account' })

        await mutation.mutateAsync({
            user_id: state.user._id
        })

        handleStateChange({ loader: '' })
    }

    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]'>

            <h2 className='text-white font-n text-[12px] sm:text-[16px]'>
                <b>Delete Your Account</b>
            </h2>

            <div className='flex justify-center mt-[20px] mb-[10px]'>


                <button className={`bg-red-500 text-white px-[15px] py-[7px] font-semibold text-[14px] rounded-[7px]`}
                    onClick={() => handleClick()}
                >
                    Delete Account
                </button>

            </div>

        </div>
    )
}

export default DelAcc