/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import StatesContext from '../../../context/StatesContext';
import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL, FRONTEND_URL } from '../../../constant';
import InputFeild from '../InputFeild';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { replaceLinks } from '../../../utils';


const InviteUserModal = ({ open, setOpen }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [loading, setLoading] = useState(false);

    const [receipent, setreceipent] = useState('')
    const [subject, setsubject] = useState('')
    const [message, setmessage] = useState('')



    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');


        setLoading(true);

        const formData = {
            seller_user_id: state.user._id,
            body_html: message,
            body: message,
            subject: subject,
            email_array: receipent.split(",").map((email) => email.trim()),
        }

        await axios
            .post(BACKEND_URL + "/user/invite", formData, {
                headers: { authorization: "Bearer " + token },
            })
            .then(function (response) {
                setLoading(false)
                handleStateChange({ success: "User Invited successfully" });
                setOpen(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            })


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
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[660px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[450px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[18px] sm:text-[22px]'>
                                    Invite User
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

                                    <form onSubmit={(e) => handleSubmit(e)} className='mt-[50px]  space-y-[15px] max-h-[400px] overflow-auto'>
                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'Recipient (Add all recipient in comma separated)'}
                                            value={receipent}
                                            onChange={setreceipent}
                                            required={true}

                                        />
                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'Subject'}
                                            value={subject}
                                            onChange={setsubject}
                                            required={true}
                                        />

                                        <textarea
                                            className='outline-none w-full bg-[rgba(225,225,225,0.1)] h-[130px] sm:h-[90px] px-[15px] py-[10px] rounded-[12px] font-r text-white font-n text-[13px] font-normal'
                                            placeholder='Body'
                                            style={{
                                                resize: 'none'
                                            }}
                                            value={message}
                                            onChange={(e) => setmessage(e.target.value)}
                                        />
                                        {state.user.salon_name && (
                                            <div className=''>
                                                <p
                                                    onClick={() => {
                                                        const formattedSalonName = state.user.salon_name.trim().toLowerCase().replace(/\s+/g, "-")
                                                        navigator.clipboard.writeText(`${FRONTEND_URL}/${formattedSalonName}`)
                                                        handleStateChange({ success: 'Link copied' })
                                                    }}
                                                    className='text-[#009688] w-fit mt-[-10px] cursor-pointer font-n font-bold text-[10px] sm:text-[13px]'>
                                                    Copy Virtual Profile Link
                                                </p>
                                            </div>
                                        )}

                                        <div className='flex justify-center pt-[10px]'>
                                            <button
                                                type='submit'
                                                disabled={loading}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px]  h-[32px] rounded-[7px]'>
                                                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Send'}
                                            </button>
                                        </div>

                                    </form>

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

export default InviteUserModal;
