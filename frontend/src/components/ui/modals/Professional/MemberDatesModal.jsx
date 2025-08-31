/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../../constant';
import StatesContext from '../../../../context/StatesContext';
import InputFeild from '../../InputFeild';
import { CircularProgress } from '@mui/material';
import axios from 'axios';




const MemberDatesModal = ({ open, setOpen, serviceData = '', setopenCalendar }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [profile_picture, setprofile_picture] = useState(serviceData?.profile_picture || '');
    const [loadingImg, setLoadingImg] = useState(false);

    const [first_name, setFirst_name] = useState(serviceData?.first_name || '');
    const [last_name, setLast_name] = useState(serviceData?.last_name || '');
    const [job_title, setJob_title] = useState(serviceData?.job_title || '');
    const [capacity, setCapacity] = useState(serviceData?.capacity || '');
    const [contact_no, setContact_no] = useState(serviceData?.contact_no || '');
    const [email, setEmail] = useState(serviceData?.email || '');

    const [loading, setLoading] = useState(false);


    const handleDelete = async (date) => {


        handleStateChange({ loader: 'Removing' })


        const token = localStorage.getItem("token");

        try {


            let unavailable_dates = []

            if (serviceData.unavailable_dates && serviceData.unavailable_dates.length > 0) {
                unavailable_dates = serviceData.unavailable_dates
            }

            unavailable_dates.splice(unavailable_dates.indexOf(date), 1)

            await axios
                .put(
                    BACKEND_URL + "/member/" + serviceData._id,
                    {
                        unavailable_dates
                    },
                    { headers: { authorization: "Bearer " + token } }
                )
                .then(function (response) {

                    handleStateChange({ success: 'Date removed successfully' })
                    setOpen(false)

                    queryClient.invalidateQueries('member')

                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });


        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        } finally {
            handleStateChange({ loader: '' })
        }


    };

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
                                    Off Dates
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

                                <div className="bg-[#141414] relative z-10  rounded-[20px] px-[10px] lg:px-[10px] py-[30px] h-full">

                                    <div className='mt-[50px] px-[10px] space-y-[15px] max-h-[400px] overflow-auto'>

                                        {(serviceData.unavailable_dates && serviceData.unavailable_dates.length) > 0 ? (
                                            <div className='space-y-[10px]'>
                                                {serviceData.unavailable_dates.map((date, index) => (
                                                    <div className='flex justify-between items-center gap-[10px] w-full h-[40px] rounded-[10px] px-[10px] bg-[rgba(225,225,225,0.1)]'>
                                                        <h2 className='text-white font-semibold text-[12px]'>
                                                            {new Date(date).toDateString()}
                                                        </h2>
                                                        <TrashIcon className='h-[20px] text-red-500 cursor-pointer'
                                                            onClick={() => {
                                                                handleDelete(new Date(date))
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='flex justify-center items-center h-[100px]'>
                                                <h2 className=' text-gray-400 text-[12px] font-semibold'>
                                                    No off dates added yet
                                                </h2>
                                            </div>
                                        )}


                                        <div className='flex justify-end pt-[10px]'>
                                            <button
                                                onClick={() => {
                                                    setopenCalendar(true)
                                                    setOpen(false)
                                                }}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>
                                                Add
                                            </button>
                                        </div>

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

export default MemberDatesModal;
