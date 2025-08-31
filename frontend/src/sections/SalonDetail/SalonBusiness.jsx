import React from 'react'
import star from '../../assets/Star.png'
import moustache from '../../assets/moustache.png'
import business from '../../assets/business.png'
import ProfContact from '../ProfSettings/Contact'

const SalonBusiness = ({ data }) => {


    return (
        <div className='relative'>

            <div className='flex flex-col items-center lg:items-start lg:flex-row gap-[20px]'>
                <img src={business} alt="" className='w-[320px] sm:w-[500px]' />
                <div>
                    <h2 className='font-m sm:pt-[15px] text-white text-[40px] sm:text-[60px] font-normal text-center leading-[56px]'>
                        Business Hours
                    </h2>
                    <div className='mt-[25px]'>
                        <ProfContact userId={data.user._id} userData={data} />
                    </div>
                </div>
            </div>




        </div>
    )
}

export default SalonBusiness