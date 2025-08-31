/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import StatesContext from '../../../context/StatesContext';
import InputFeild from '../InputFeild';
import { BACKEND_URL } from '../../../constant';
import { generateRandomEmail } from '../../../utils';
import { CircularProgress } from '@mui/material';
import axios from 'axios';



const AddAppointmentModal = ({ open, setOpen, setname, setphone, selectedService, setselectedService, name, phone, setopenBook }) => {

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;
    const [serviceArr, setServiceArr] = useState();
    const [loadingApp, setLoadingAdd] = useState(false);


    const { data } = useQuery({
        queryKey: ['service'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/service/get-all-professional-service/${state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    const handleSubmit = async () => {

        const token = localStorage.getItem('token');

        setLoadingAdd(true);
        const email = generateRandomEmail();

        let formData = {
            first_name: name,
            phone_number: phone,
            email: email
        }


        try {
            await axios
                .post(BACKEND_URL + "/user/offline-signup", formData, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    if (
                        response &&
                        response.data &&
                        response.data.user &&
                        response.data.user.user_id
                    ) {
                        setselectedService({ ...selectedService, customerId: response.data.user.user_id });
                    } else {
                        if (response && response.data && response.data.existingUser) {
                            setselectedService({ ...selectedService, customerId: response.data.existingUser._id });
                        }
                    }

                    setOpen(false)
                    setopenBook(true)

                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoadingAdd(false);
        }

    };


    useEffect(() => {

        if (data && data.length > 0) {

            const newArray = data.map((item) => ({
                ...item,
                label:
                    item.service_name +
                    " | " +
                    item.period +
                    " min | " +
                    item.price +
                    "$",
            }));
            setServiceArr(newArray);
        }

    }, [data])



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
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[600px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center gap-[20px] right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] font-bold font-r text-[15px] sm:text-[22px]'>
                                    Add Appointment for walk-in customers
                                </h2>
                                <div className='h-[28px] w-[28px] flex-shrink-0 cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
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

                                        <div className='space-y-[15px]'>


                                            <InputFeild
                                                isSetting={true}
                                                placeholder={'Name'}
                                                onChange={setname}
                                            />
                                            <InputFeild
                                                isSetting={true}
                                                placeholder={'Phone Number'}
                                                required={true}
                                                type={'number'}
                                                onChange={setphone}
                                            />

                                            <select
                                                name="endTime"
                                                className="bg-[rgba(225,225,225,0.08)] cursor-pointer outline-none text-white text-[12px] w-full h-[42px] px-[12px] rounded-[12px]"
                                                id="endTime"
                                                style={{
                                                    appearance: "none",
                                                    WebkitAppearance: "none",
                                                    MozAppearance: "none",
                                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "right 10px center", // Moves the arrow
                                                    backgroundSize: "20px",
                                                }}
                                                value={selectedService ? JSON.stringify(selectedService) : ""}
                                                onChange={(e) => {
                                                    setselectedService(JSON.parse(e.target.value));
                                                }}
                                            >
                                                <option value="" className='bg-[#242424] cursor-pointer text-white text-left'>
                                                    Select Service
                                                </option>
                                                {serviceArr && serviceArr.length > 0 && serviceArr.map((service, index) => (
                                                    <option key={index} value={JSON.stringify(service)} className='bg-[#242424] text-white text-left'>
                                                        {service.label}
                                                    </option>
                                                ))}
                                            </select>



                                            <div className='flex justify-end pt-[10px]'>
                                                <button
                                                    className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px]  h-[32px] rounded-[7px]'
                                                    onClick={() => {
                                                        if (!name || !phone || !selectedService || selectedService === 'Select Service') {
                                                            handleStateChange({ error: 'Please fill all the fields' })
                                                            return
                                                        }

                                                        if (loadingApp) return

                                                        handleSubmit()


                                                    }}
                                                >
                                                    {loadingApp ? <CircularProgress sx={{ color: 'white' }} size={17} /> : 'Next'}
                                                </button>
                                            </div>

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

export default AddAppointmentModal;
