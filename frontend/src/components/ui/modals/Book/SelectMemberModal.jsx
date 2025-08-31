/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import StatesContext from '../../../../context/StatesContext';
import { BACKEND_URL } from '../../../../constant';
import { CircularProgress, Rating } from '@mui/material';


const SelectMemberModal = ({ open, setOpen, selectedData, setselectedData, setopenTime }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;


    const { data, isLoading } = useQuery({
        queryKey: ['salon-members'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/member/get-all-member/${selectedData.salonId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });

    console.log(data);

    return (
        <div>
            {open && (
                <div
                    className="fixed top-0 left-0 w-full h-full z-50"
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                    }}
                ></div>
            )}

            {open && (
                <div
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[750px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[700px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[22px]'>
                                    Select Professional
                                </h2>
                                <div className='h-[28px] w-[28px] cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
                                    onClick={() => {
                                        setOpen(false)
                                    }}
                                >
                                    <XMarkIcon className='h-[14px] text-white' />
                                </div>
                            </div>

                            <div className=' w-full  rounded-[20px] relative '>

                                <div className="bg-[#141414] relative z-10  rounded-[20px] px-[10px] lg:px-[20px] py-[30px] h-full">

                                    <div className='mt-[50px] px-[10px] space-y-[15px] max-h-[400px] overflow-auto'>

                                        {isLoading ? (
                                            <div className='flex justify-center items-center h-[200px]'>
                                                <CircularProgress sx={{ color: 'white' }} />
                                            </div>

                                        ) : (
                                            <div>
                                                {data && data.length > 0 && (
                                                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-[15px]'>
                                                        {data.map((item, index) => (
                                                            <div key={index} className='w-full h-[160px] hover:border-[#009688] duration-500 cursor-pointer border border-gray-700 rounded-[12px] flex flex-col justify-center items-center'
                                                                onClick={() => {

                                                                    setselectedData({
                                                                        ...selectedData,
                                                                        memberId: item.item._id,
                                                                        memberName: item.item.first_name + ' ' + item.item.last_name,
                                                                    })

                                                                    setOpen(false)
                                                                    setopenTime(true)
                                                                }}
                                                            >
                                                                <img
                                                                    className='w-[60px] h-[60px] rounded-full object-cover'
                                                                    src={item.item.profile_picture} alt="" />

                                                                <div className='flex items-center gap-[2px] mt-[5px]'>
                                                                    <Rating
                                                                        value={item.rating?.avgRating || 0}
                                                                        readOnly
                                                                        precision={0.5}
                                                                        style={{
                                                                            fontSize: '14px'

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
                                                                    <h2 className='text-gray-200 text-[12px]'>
                                                                        ({item.rating?.totalRatings || 0})
                                                                    </h2>
                                                                </div>

                                                                <h2 className='text-center text-white font-bold text-[14px] pt-[4px]'>
                                                                    {item.item.first_name} {item.item.last_name}
                                                                </h2>
                                                                <h2 className='text-center text-white text-[12px] '>
                                                                    {item.item.job_title}
                                                                </h2>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {data && data.length === 0 && (
                                                    <h2 className='text-white text-center font-normal font-n text-[13px] py-[40px]'>
                                                        No Professionals are there at moment..
                                                    </h2>
                                                )}

                                            </div>
                                        )}


                                    </div>

                                </div>

                                <div className='absolute inset-[-2px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[20px]' />


                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SelectMemberModal;
