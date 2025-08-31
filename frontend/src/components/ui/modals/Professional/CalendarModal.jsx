/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../../constant';
import StatesContext from '../../../../context/StatesContext';
import InputFeild from '../../InputFeild';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import CustomCalendar from '../../../Calendar/Calendar';




const CalendarModal = ({ open, setOpen, serviceData = '' }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { handleStateChange } = context;

    const [loading, setLoading] = useState(false);

    const [date, setdate] = useState('')


    const handleSubmit = async () => {


        handleStateChange({ loader: 'Adding' })


        const token = localStorage.getItem("token");

        try {
            if (date) {

                let unavailable_dates = [];

                if (serviceData.unavailable_dates && serviceData.unavailable_dates.length > 0) {
                    unavailable_dates = [...serviceData.unavailable_dates]; // Copy existing dates
                }

                // Convert date to string (ISO format) to ensure correct comparison
                const formattedDate = new Date(date).toISOString().split("T")[0];

                // Check if the date already exists
                const isDateExists = unavailable_dates.some(
                    (d) => new Date(d).toISOString().split("T")[0] === formattedDate
                );

                if (isDateExists) {

                    handleStateChange({ error: 'This date is already added!' })
                    return;

                } else {
                    unavailable_dates.push(new Date(date)); // Add date if it's not a duplicate
                }

                await axios
                    .put(
                        BACKEND_URL + "/member/" + serviceData._id,
                        {
                            unavailable_dates
                        },
                        { headers: { authorization: "Bearer " + token } }
                    )
                    .then(function (response) {

                        handleStateChange({ success: 'Date added successfully' })
                        setOpen(false)

                        queryClient.invalidateQueries('member')

                    })
                    .catch(function (error) {
                        console.log(error);
                        setLoading(false);
                    });
            }

        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        } finally {
            handleStateChange({ loader: '' })
        }


    };


    useEffect(() => {

        if (date) {
            handleSubmit()
        }

    }, [date])


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
                                    Select Date
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

                                    <div className='mt-[50px] px-[20px] space-y-[15px] '>


                                        <div className='mt-[40px] w-full'>
                                            <CustomCalendar bookedDates={[]} setdate={setdate} />
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

export default CalendarModal;
