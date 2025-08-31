/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import StatesContext from '../../../context/StatesContext';
import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../constant';
import { CircularProgress } from '@mui/material';



const ReportModal = ({ open, setOpen, reportId }) => {


    const context = useContext(StatesContext);
    const { handleStateChange } = context;

    const delComment = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/report`, {

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

            handleStateChange({ success: 'Report submitted successfully!' })

        },
        onError(error) {
            console.log(error)
        }


    })

    const handleDel = async () => {

        handleStateChange({ loader: 'Reporting' })
        setOpen(false)
        await delComment.mutateAsync({ id: reportId })
        handleStateChange({ loader: '' })


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
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[550px]"
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
                                <h2 className='text-[#009688] text-center font-bold font-r text-[22px]'>
                                    Report Post
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

                                    <div className='mt-[50px] space-y-[15px] max-h-[400px] overflow-auto'>

                                        <h2 className='text-white text-center text-[16px]'>
                                            Are you sure you want to report this post?
                                        </h2>

                                        <div className='flex justify-center'>
                                            <button
                                                type='submit'
                                                disabled={delComment.isPending}
                                                onClick={() => handleDel(reportId)}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px]  w-[100px]  h-[32px]  rounded-[7px]'>
                                                {delComment.isPending ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Report'}
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

export default ReportModal;
