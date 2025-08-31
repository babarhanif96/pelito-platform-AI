import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../constant';


import SalonBusiness from '../sections/SalonDetail/SalonBusiness';
import SalonGallery from '../sections/SalonDetail/SalonGallery';
import SalonProduct from '../sections/SalonDetail/SalonProduct';
import SalonServices from '../sections/SalonDetail/SalonServices';
import Mininav from '../Mininav';
import Nav from '../Nav';
import Footer from '../Footer';

const SalonDetail = () => {

    const navigate = useNavigate()

    const { name } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ['professionals', name],
        queryFn: () => {
            return fetch(`${BACKEND_URL}/user/get-salon-details/${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(async (res) => await res.json());
        },
    });


    useEffect(() => {

        if (data && data.message && data.message === 'Internal Server Error') {
            navigate('/professionals')
        }

    }, [data])


    return (
        <div>

            <Mininav />
            <Nav />

            <div className='w-full h-full bg-[#141414] min-h-screen'>
                <div className='mx-auto  '>
                    {isLoading ? (
                        <div className='flex justify-center items-center min-h-screen'>
                            <CircularProgress sx={{ color: 'white' }} />
                        </div>
                    ) : (
                        <div>

                            {data && data.user && (
                                <div>
                                    <div className='relative'>
                                        <img src={data.user.cover_pic} alt="" className='h-[180px] sm:h-[380px] w-full object-cover' />
                                        <div className='absolute inset-0'>
                                            <div className='bg-[rgba(0,0,0,0.5)] h-full w-full' />
                                        </div>
                                        <div className='absolute top-0 left-0 bottom-0 right-0 max-w-[1263px] px-[20px] mx-auto flex flex-col justify-center'>
                                            <h2 className='text-white font-m text-[40px] sm:text-[70px] font-normal'>
                                                {data.user.salon_name}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className='bg-[#202022] w-full pb-[60px] sm:pb-[100px]'>
                                        <div className='max-w-[1263px] px-[20px] mx-auto pt-[40px] sm:pt-[80px]'>
                                            <SalonServices data={data.service} />
                                            {data.product && data.product.length > 0 && (
                                                <div className='pt-[40px] sm:pt-[80px]'>
                                                    <SalonProduct data={data.product} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {data.professionalWorkingImages && data.professionalWorkingImages.length > 0 && (
                                        <div className='bg-[#141414] w-full pb-[60px] sm:pb-[100px]'>
                                            <div className='max-w-[1263px] px-[20px] mx-auto pt-[40px] sm:pt-[80px]'>
                                                <SalonGallery data={data.professionalWorkingImages} />

                                            </div>
                                        </div>
                                    )}

                                    <div className='bg-[#202022] w-full pb-[40px] sm:pb-[80px]'>
                                        <div className='max-w-[1263px] px-[20px] mx-auto pt-[40px] sm:pt-[80px]'>
                                            <SalonBusiness data={data} />

                                        </div>
                                    </div>

                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default SalonDetail