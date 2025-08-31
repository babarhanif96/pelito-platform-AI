import React from 'react'
import star from '../../assets/Star.png'
import moustache from '../../assets/moustache.png'
import Masonry from 'react-masonry-css'


const SalonGallery = ({ data }) => {

    const breakpointObj = {
        default: 3,
        1500: 3,
        1200: 3,
        1000: 2,
        600: 2
    }

    return (
        <div className='relative'>

            <div className='absolute top-0 left-[30px]'>
                <img src={star} className='h-[30px] sm:h-[45px]' alt="" />
            </div>

            <h2 className='font-m sm:pt-[10px] text-white text-[40px] sm:text-[60px] font-normal text-center leading-[56px]'>
                Our Gallery
            </h2>
            <p className='font-r text-white font-normal text-[16px] sm:text-[21px] sm:pt-[5px] text-center'>
                Precision grooming for a polished look
            </p>

            <div className=' mt-[30px] sm:mt-[80px] px-[10px] max-h-[500px] overflow-auto'>


                <Masonry breakpointCols={breakpointObj} className='flex w-full'>
                    {data.map((item, i) => (
                        <div key={i} className='flex justify-center sm:justify-normal'>
                            <img src={item.image_urls} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </Masonry>

            </div>

        </div>
    )
}

export default SalonGallery