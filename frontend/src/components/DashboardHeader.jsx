import React, { useContext } from 'react'
import StatesContext from '../context/StatesContext'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'

import cart from '../assets/cart.png'

const DashboardHeader = ({ title }) => {

    const context = useContext(StatesContext)
    const { state } = context


    const navigate = useNavigate()

    return (
        <div className='flex justify-center md:justify-between items-center pt-[30px] md:pt-0'>
            <h2 className='text-white font-r text-[28px] sm:text-[32px] text-center font-bold'>{title}</h2>
            <div className='flex items-center gap-[15px]'>

                <img src={cart} alt="" className='h-[20px] hidden md:block cursor-pointer' 
                onClick={() => navigate('/cart')}
                />

                <div className='bg-[#141414] hidden md:flex rounded-[20px] items-center gap-[10px] py-[5px] pl-[5px] pr-[20px] cursor-pointer'
                    onClick={() => navigate('/professional/settings')}
                >
                    <img
                        src={state.user.profile_picture}
                        className='w-[29px] h-[29px] rounded-[20px]'
                        alt=""
                    />
                    <h2 className='font-n text-[14px] font-semibold text-white'>
                        {state.user.first_name} {state.user.last_name}
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader