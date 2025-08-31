/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import StatesContext from '../../../context/StatesContext';
import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../constant';
import InputFeild from '../InputFeild';
import { CircularProgress } from '@mui/material';



const ProfessorModal = ({ open, setOpen }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [password, setpassword] = useState('')
    const [newPassword, setnewPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    const mutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/user/reset-password/${state.user._id}`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            const res = await data.json()

            if (res.success) {

                queryClient.invalidateQueries('user')
                handleStateChange({ success: 'Password updated successfully' })
                setOpen(false)
            } else {
                handleStateChange({ error: res.message })
            }


        },
        onError(error) {
            console.log(error)
        }


    })

    const handleClick = (e) => {

        e.preventDefault()

        if (newPassword !== confirmPassword) {
            handleStateChange({ error: 'New password does not match' })
            return
        }

        mutation.mutate({
            current_password: password,
            password: newPassword,
            confirmpassword: confirmPassword,
        })

    }


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
                                    Change Password
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

                                    <form onSubmit={(e) => handleClick(e)} className='mt-[50px]  space-y-[15px] max-h-[400px] overflow-auto'>
                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'Old Password'}
                                            type={'password'}
                                            password={true}
                                            value={password}
                                            onChange={setpassword}
                                            required={true}

                                        />
                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'New Password'}
                                            type={'password'}
                                            password={true}
                                            value={newPassword}
                                            onChange={setnewPassword}
                                            required={true}
                                        />
                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'Confirm Password'}
                                            type={'password'}
                                            password={true}
                                            value={confirmPassword}
                                            onChange={setconfirmPassword}
                                            required={true}
                                        />

                                        <div className='flex justify-center pt-[10px]'>
                                            <button
                                                type='submit'
                                                disabled={mutation.isPending}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px]  h-[32px] rounded-[7px]'>
                                                {mutation.isPending ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Update'}
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

export default ProfessorModal;
