import React from 'react'
import star from './assets/Star 3.png'
import mouth from './assets/moustache 2.png'
import kol from './assets/Rectangle 1033.png'
import mnh from './assets/Rectangle 1034.png'
import bhn from './assets/Rectangle 1035 (1).png'
import bnv from './assets/Rectangle 1034 (1).png'
import vfc from './assets/Rectangle 1035 (2).png'
import edr from './assets/Rectangle 1038.png'
import jik from './assets/beautiful-woman-has-cutting-hair-hairdresser.png'
import f1 from './assets/01.png'
import f2 from './assets/02.png'
import f3 from './assets/03.png'
import f4 from './assets/04.png'
import f5 from './assets/05.png'



const Gallery = () => {
    return (
        <>
            <div className='bg-black relative py-20'>
                <img className='absolute md:right-[10rem] top-[2rem]' src={star} alt="" />
                <div className='flex flex-col justify-center items-center'>
                    <img className='' src={mouth} alt="" />
                    <h1 className='text-[40px] md:text-[60px] font-m text-white'>Our Services</h1>
                    <p className='text-[16px] md:text-[20px] body text-white'>Precision grooming for a polished look</p>
                </div>
                <div className='xl:pl-10 pt-10'>
                    <div className='flex'>
                        <img src={kol} alt="" />
                        <img src={mnh} alt="" />
                        <img src={bhn} alt="" />
                    </div>
                    <div className='flex'>
                        <img src={bnv} alt="" />
                        <img src={vfc} alt="" />
                        <img src={edr} alt="" />
                    </div>
                </div>
            </div>
            <div>
                <div className='flex md:flex-row flex-col pl-4 bg-[#1f1e20] xl:pl-20 gap-10 py-20'>
                    <img className='w-[450px] h-[550px] lg:w-[554px] lg:h-[682px]' src={jik} alt="" />
                    <div className='text-white flex flex-col gap-10'>
                        <h1 className='text-[40px] lg:text-[60px] font-m text-white'>Business hours</h1>
                        <div className='flex  gap-6'>
                            <div className='flex flex-col gap-10'>
                                <div className="flex gap-10 items-center">
                                    <h3 className='text-[20px] body'>Monday</h3>
                                    <p className='text-[15px] body'>9:00 am – 7:30 pm</p>
                                </div>
                                <div className="flex gap-10 items-center">
                                    <h3 className='text-[20px] body'>Tuesday</h3>
                                    <p className='text-[15px] body'>9:00 am – 7:30 pm</p>
                                </div>
                                <div className="flex gap-10 items-center">
                                    <h3 className='text-[20px] body'>Wednesday</h3>
                                    <p className='text-[15px] body'>9:00 am – 7:30 pm</p>
                                </div>
                                <div className="flex gap-10 items-center">
                                    <h3 className='text-[20px] body'>Thursday</h3>
                                    <p className='text-[15px] body'>9:00 am – 7:30 pm</p>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <h3 className='text-[20px] body'>Friday</h3>
                                    <p className='text-[15px] body'>9:00 am – 7:30 pm</p>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <h3 className='text-[20px] body'>Sat/Sun</h3>
                                    <p className='text-[15px] body'>closed</p>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
            <div className='flex md:flex-row flex-col'>
            <img className='w-full md:w-[220px] h-[288px]' src={f1} alt="" />
                    <img src={f2} alt="" />
                    <img src={f3} alt="" />
                    <img src={f4} alt="" />
                    <img src={f5} alt="" />
                </div>
        </>
    )
}

export default Gallery
