import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router'

import fty from './assets/Frame 5.png'
import gty from './assets/Rectangle 934.png'
import star from './assets/Star 3.png'
import elli from './assets/Ellipse 10336.png'
import arow from './assets/Arrow_Down_Left_MD.png'

import img1 from './assets/slide/001.png'
import img2 from './assets/slide/002.png'
import img3 from './assets/slide/003.png'
import img4 from './assets/slide/004.png'
import img5 from './assets/slide/005.png'
import img6 from './assets/slide/006.png'
import img7 from './assets/slide/007.png'
import img8 from './assets/slide/008.png'
import img9 from './assets/slide/009.png'
import img10 from './assets/slide/010.png'

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]

function Header() {
    const [activeImage, setActiveImage] = useState(0)
    const [loaded, setLoaded] = useState(false) // Track if all images are preloaded
    const navigate = useNavigate()

    useEffect(() => {
        let loadedImages = 0;
        const imageObjects = images.map((src) => {
            const img = new Image()
            img.src = src
            img.onload = () => {
                loadedImages++
                if (loadedImages === images.length) {
                    setLoaded(true) // Set to true when all images are loaded
                }
            }
            return img
        })
    }, [])

    useEffect(() => {
        if (!loaded) return // Don't start slider until all images are loaded

        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length)
        }, 2000)

        return () => clearInterval(interval)
    }, [loaded])

    return (
        <>
            <div className='flex justify-end relative'>

                <img className='w-full h-[250px] md:h-[550px]' src={fty} alt="" />
                <div>
                    <img className='h-[250px] md:h-[550px] w-full absolute right-[1rem]' src={gty} alt="" />
                </div>
                <div className='absolute text-white right-[6rem] mm:right-[8rem] top-[2rem] md:right-[20rem] lg:right-[40rem] md:top-[8rem]'>
                    <h1 className="text-[20px] md:text-[40px] lg:text-[50px] xl:text-[65px] font-m text-white 
               leading-snug md:leading-tight lg:leading-[1.2] tracking-wide 
               mb-4 md:mb-6 lg:mb-8">
                        REAL CUTS BY REAL <br />
                        PROFESSIONALS.
                    </h1>


                    <div className='mt-[20px] max-w-[300px] md:max-w-full flex gap-[4px] items-center'>
                        <input type="text"
                            className='w-full grow bg-transparent text-white outline-none border border-gray-700 px-[10px] h-[35px] rounded-[8px] text-[12px] sm:text-[13px]'
                            placeholder='Search for services or professionals'
                        />
                        <div className='h-[33px] w-[35px] flex justify-center items-center bg-[#66FCF1] rounded-[8px] cursor-pointer'
                            onClick={() => navigate('/professionals')}
                        >
                            <MagnifyingGlassIcon className='text-black h-[18px]' />
                        </div>
                    </div>
                </div>

            </div>

            <div className='bg-[#141414] flex md:flex-row flex-col items-center justify-between'>
                <div className='flex flex-col gap-8'>
                    <div className='ml-8 lg:ml-20 text-white pt-10'>
                        <img className=' lg:pl-[30rem]' src={star} alt="" />
                        <div className='max-w-[550px]'>
                            <h1 className='text-[36px] pt-[20px] lg:text-[60px] font-m text-white leading-[40px] sm:leading-[60px]'>
                                Reserve services from nearby beauty experts.
                            </h1>

                            <p className='text-[18px] pt-[20px]'>
                                Discover beauty at your fingertips! Effortlessly schedule appointments with skilled professionals for a pampering session in the comfort of your own space.
                            </p>


                        </div>
                    </div>
                    <div className='flex gap-4 md:gap-28 ml-8 lg:ml-20'>
                        <div>
                            <h1 className='text-[40px] md:text-[70px] font-m text-[#66FCF1]'>99%</h1>
                            <h3 className='font-m text-[25px] md:text-[30px] text-white'>Customer <br /> Satisfaction</h3>
                        </div>
                        <div>
                            <h1 className='font-m text-[40px] md:text-[70px] text-[#66FCF1]'>10+</h1>
                            <h3 className='font-m text-[25px] md:text-[30px] text-white'>years of <br /> experience</h3>
                        </div>
                    </div>
                </div>

                {/* Image Slider with Animation */}
                {loaded && (
                    <motion.img
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className='pt-10 pb-[10px] w-[300px] lg:w-[554px] h-[300px] object-contain sm:h-[400px] lg:h-[657px]'
                        src={images[activeImage]}
                        alt=""
                    />
                )}
            </div>
        </>
    )
}

export default Header;
