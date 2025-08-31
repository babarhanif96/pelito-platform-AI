import React from 'react'
import logo from './assets/Frame 1686551906.png'
import play from './assets/line.png'
import vre from './assets/akar-icons_instagram-fill.png'
import dws from './assets/tabler_brand-linkedin.png'
import fed from './assets/ri_facebook-fill.png'
import { useNavigate } from 'react-router'

const Footer = () => {

    const navigate = useNavigate()

    return (
        <div className='bg-black'>
            <div className=' max-w-[700px] mx-auto flex md:flex-row flex-col gap-2 md:gap-0 justify-between items-center py-10 px-10'>
                <div className='text-white flex flex-col gap-3'>
                    <h1 className='text-[20px] text-white text-center underline font-m'>Contact</h1>
                    <p className='text-[14px] text-center body'>support@pelito.net <br />
                    </p>
                </div>
                <div className='bg-white md:h-[200px] w-[300px] h-[3px] md:w-[5px]'></div>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex flex-col items-center'>
                        <img className='w-[90px] h-[80px]' src={logo} alt="" />
                        <h1 className='text-[48px] text-white font-m tracking-widest'>PELITO</h1>
                    </div>
                    <div className='flex gap-4'>
                        <img className='w-[18px] h-[18px]' src={fed} alt="" />
                        <img className='h-[20px]' src={play} alt="" />
                        <img className='w-[18px] h-[18px]' src={vre} alt="" />
                        <img className='h-[20px]' src={play} alt="" />
                        <img className='w-[20px] h-[20px]' src={dws} alt="" />
                    </div>
                </div>

            </div>
            <div className='bg-black'>
                <div className='bg-white w-full h-[1px] md:h-[3px]'></div>
                <div className='flex justify-between items-center px-4 md:px-10 py-6 md:py-10'>
                    <p className='text-[8px] md:text-[12px] text-white body'>Copyright By @ pelito 2025</p>
                    <div className='text-white flex gap-4'>
                        <p className='text-[8px] md:text-[12px] body cursor-pointer' 
                        onClick={() => {
                            navigate('/terms/conditions')
                        }}
                        >Terms & Conditions</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
