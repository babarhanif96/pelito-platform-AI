import React from 'react'
import hrf from './assets/Frame 5 (1).png'
import gty from './assets/Rectangle 934 (1).png'
import star from './assets/Star 3.png'
import mouth from './assets/moustache 2.png'
import get from './assets/img (3).png'
import get2 from './assets/img (4).png'
import get3 from './assets/img (5).png'

const Header3 = () => {
    return (
        <>
            <div className='relative flex justify-end'>
                <img src={hrf} alt="" />
                <div>
                    <img className='h-[385px] w-full absolute right-[1rem]' src={gty} alt="" />
                </div>
                <div className='absolute left-[5rem] top-[8em]'>
                    <h1 className='text-[70px] text-white font-m'>Luxe Styles Studio</h1>
                </div>
            </div>
            <div className='bg-[#202022] py-20'>
                <img className='pl-20' src={star} alt="" />
                <div className='flex flex-col justify-center items-center'>
                    <img className='' src={mouth} alt="" />
                    <h1 className='text-[60px] font-m  text-white'>Our Services</h1>
                    <p className='text-[20px] body  text-white'>Precision grooming for a polished look</p>
                </div>
                <div className='flex items-center justify-between px-48 py-3 pt-10'>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px]' src={get} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-center'>
                            <h1 className='text-[20px] font-m text-white'>Regular haircut</h1>
                            <p className='text-[20px] body text-white'>$50.00/40 mins</p>
                            <button className='text-[16px] rounded-full slow border-cyan-400 text-white px-12 py-1 font-bold  bg-[#303030] hover:bg-cyan-400 hover:text-black transition-all'>Book</button>
                        </div>
                    </div>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px]' src={get2} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-center'>
                            <h1 className='text-[20px] font-m text-white'>Regular haircut</h1>
                            <p className='text-[20px] body text-white'>$50.00/40 mins</p>
                            <button className='text-[16px] rounded-full slow border-cyan-400 text-white px-12 py-1 font-bold  bg-[#303030] hover:bg-cyan-400 hover:text-black transition-all'>Book</button>
                        </div>
                    </div>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px]' src={get3} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-center'>
                            <h1 className='text-[20px] font-m text-white'>Regular haircut</h1>
                            <p className='text-[20px] body text-white'>$50.00/40 mins</p>
                            <button className='text-[16px] rounded-full slow border-cyan-400 text-white px-12 py-1 font-extrabold  bg-[#303030] hover:bg-cyan-400 hover:text-black transition-all'>Book</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header3
