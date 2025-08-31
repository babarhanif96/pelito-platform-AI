import React, { useContext } from 'react'
import img from './assets/Clock.png'
import pop from './assets/Phone.png'
import play from './assets/line.png'
import hut from './assets/tabler_logout.png'
import byu from './assets/Line 26.png'
import vre from './assets/akar-icons_instagram-fill.png'
import gtf from './assets/mingcute_youtube-line.png'
import fed from './assets/ri_facebook-fill.png'
import dws from './assets/tabler_brand-linkedin.png'
import StatesContext from './context/StatesContext'
import { useNavigate } from 'react-router-dom'

const Mininav = () => {

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const navigate = useNavigate()

    return (
        <>
            <div className='bg-[#1f1e20] hidden  justify-between items-center px-4 xl:px-24 lg:px-6'>
                <div className='flex md:flex-row flex-col gap-4  py-4'>
                    <div className='flex gap-4'>
                        <img className='md:w-[19px] w-[22px] lg:w-[21px] h-[22px] md:h-[19px] lg:h-[21px]' src={img} alt="" />
                        <p className='text-white text-[15px] md:text-[12px] lg:text-[15x] xl:text-[17px]'>Mon-Fri 9.00: 17.00</p>
                    </div>
                 
                </div>
                <div className='flex md:flex-row flex-col py-4 gap-2 md:gap-3 lg:gap-4'>
                    {state.user ? (
                        <p className='text-white text-[11px] md:text-[16px] lg:text-[17px] cursor-pointer'> <span onClick={() => {

                            if (state.user.user_type === 'professional') {
                                navigate('/professional/news-feed')
                            } else {
                                navigate('/dashboard')
                            }

                        }}>Dashboard</span>  </p>
                    ) : (
                        <>

                            <img className='w-[18px] md:w-[22px] lg:w-[24px] h-[18px] md:h-[22px] lg:h-[24px]' src={hut} alt="" />
                            <p className='text-white text-[11px] md:text-[16px] lg:text-[17px] cursor-pointer'> <span onClick={() => navigate('/login')}>Login</span>  /  <span onClick={() => navigate('/register')}>Register</span></p>

                        </>
                    )}
                    <img className='h-[2px] md:h-[20px]' src={play} alt="" />
                    <img className='w-[16px] lg:w-[18px] h-[16px] lg:h-[18px]' src={fed} alt="" />
                    <img className='h-[2px] md:h-[20px]' src={play} alt="" />
                    <img className='w-[16px] lg:w-[18px] h-[16px] lg:h-[18px]' src={vre} alt="" />
                    <img className='h-[2px] md:h-[20px]' src={play} alt="" />
                    <img className='w-[18px] lg:w-[20px] h-[18px] lg:h-[20px]' src={dws} alt="" />
                    <img className='h-[2px] md:h-[20px]' src={play} alt="" />
                    <img className='w-[18px] lg:w-[20px] h-[18px] lg:h-[20px]' src={gtf} alt="" />
                    <img className='h-[2px] md:h-[20px]' src={byu} alt="" />
                </div>

            </div>

        </>
    )
}

export default Mininav