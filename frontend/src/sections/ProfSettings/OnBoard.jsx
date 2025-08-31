import React, { useContext } from 'react'
import StatesContext from '../../context/StatesContext'
import { CircularProgress } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'

const OnBoard = () => {

    const queryClient = useQueryClient()

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    console.log(state)

    const mutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/user/professional/stripe-payments`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('user')

            setTimeout(() => {

                handleStateChange({ loader: '' })
            }, 2000);


        },
        onError(error) {
            console.log(error)
        }


    })

    const handleClick = async () => {

        if (state.onBoardUrl) {

            if (state.onBoardUrl !== 'Connected') {
                handleStateChange({ error: 'Please connect your Stripe account first!' })
                return
            }

            handleStateChange({ loader: 'Updating' })

            await mutation.mutateAsync({
                user_id: state.user._id,
            });
        }
    };


    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]'>
            <h2 className='text-white font-n text-[12px] sm:text-[16px]'>
                <b>Streamline Your Payments:</b>   Easily Set Up Your Stripe Account for Seamless Transactions

            </h2>

            <div className='flex justify-center mt-[20px] mb-[10px]'>
                {!state.onBoardUrl ? (
                    <CircularProgress sx={{ color: 'white' }} />
                ) : (
                    <div className='flex items-center flex-col sm:flex-row gap-[15px] sm:gap-[10px]'>
                        <button className={` ${state.onBoardUrl === 'Connected' ? 'bg-[#009688]' : 'bg-[#F57C00]'} text-white px-[15px] py-[7px] font-semibold text-[12px] sm:text-[14px] rounded-[7px]`}
                            onClick={() => {
                                if (state.onBoardUrl && state.onBoardUrl !== 'Connected') {
                                    window.open(state.onBoardUrl, '_blank')
                                }
                            }}
                        >
                            {state.onBoardUrl === 'Connected' ? 'Account Connected' : 'Click here to Onboard'}
                        </button>
                        <button className={` ${!state.user.IsStripeEnabled ? 'bg-[#009688]' : 'bg-red-500'} text-white px-[15px] py-[7px] font-semibold text-[12px] sm:text-[14px] rounded-[7px]`}
                            onClick={() => {
                                handleClick()
                            }}
                        >
                            {state.user.IsStripeEnabled ? 'Disable Stripe Payment' : 'Enable Stripe Payment'}
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default OnBoard