import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { BACKEND_URL } from '../constant';
import { CircularProgress, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Mininav from '../Mininav';
import Nav from '../Nav';
import Footer from '../Footer';

const Professionals = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['professionals'],
        queryFn: () => {
            return fetch(`${BACKEND_URL}/user/professional-user?page=1&limit=3`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(async (res) => await res.json());
        },
    });



    return (
        <div>
            <Mininav />
            <Nav />
            <div className='w-full h-full bg-[#141414] min-h-screen'>
                <div className='max-w-[1263px] mx-auto px-[20px] pt-[100px] pb-[40px]'>

                    <h2 className='text-white font-n text-[16px] sm:text-[20px] font-semibold'>
                        Top-rated hairstylists offering the best services across the United States

                    </h2>

                    {isLoading ? (
                        <div className='flex justify-center items-center h-[300px]'>
                            <CircularProgress sx={{ color: 'white' }} />
                        </div>
                    ) : (
                        <>
                            {data?.length > 0 && (
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] mt-[40px]'>
                                    {data.map((item, index) => (
                                        <div key={index} className='rounded-[15px] overflow-hidden bg-[rgba(225,225,225,0.05)] cursor-pointer hover:scale-105 duration-500'

                                            onClick={() => {
                                                const formattedSalonName = item.user.salon_name.replace(/\s+/g, '-');
                                                navigate(`/${formattedSalonName}`);
                                            }}

                                        >
                                            <img src={item.user.profile_picture} alt="" className='h-[200px] sm:h-[230px] w-full object-cover' />
                                            <div className='px-[13px] pt-[7px] pb-[20px]'>
                                                <h2 className='text-white font-r font-bold text-[17px]'>
                                                    {item.user.salon_name}
                                                </h2>

                                                <div className='flex items-center gap-[2px]'>
                                                    <Rating
                                                        value={item.rating?.avgRating || 0}
                                                        readOnly
                                                        precision={0.5}
                                                        style={{
                                                            fontSize: '17px'

                                                        }}
                                                        sx={{
                                                            '& .MuiRating-iconEmpty': {
                                                                color: '#009688',  // Change color of non-active star
                                                                borderColor: '#009688 !important', // Change border color of non-active star
                                                            },
                                                            marginTop: '2px',
                                                            marginLeft: '-1.5px'
                                                        }}
                                                    />
                                                    <h2 className='text-gray-200 text-[14px]'>
                                                        ({item.rating?.totalRatings || 0})
                                                    </h2>
                                                </div>

                                                <h2 className='text-white line-clamp-2 text-[15px]'>
                                                    {item.user.description}
                                                </h2>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {data?.length === 0 && (

                                <div className='flex justify-center items-center h-[300px]'>
                                    <p className='text-white'>No professionals found</p>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Professionals