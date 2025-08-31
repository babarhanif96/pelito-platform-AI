/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import StatesContext from '../../../context/StatesContext';
import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../constant';



const CommentsModal = ({ open, setOpen, commentsData }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const delComment = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/delete-comment/${commentsData._id}/${newData.id}`, {

                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('posts')
            handleStateChange({ loader: '' })
            handleStateChange({ success: 'Comment deleted successfully' })

        },
        onError(error) {
            console.log(error)
        }


    })

    const handleDel = (id) => {
        handleStateChange({ loader: 'Deleting...' })
        delComment.mutate({ id: id })
        setOpen(false)
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
                        <div className='relative w-[90%] sm:max-w-[500px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[22px]'>
                                    Comments
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
                                        {commentsData.comments.map((comment, index) => (
                                            <div key={index} className='flex items-center gap-[20px] justify-between'>
                                                <div className='flex items-center gap-[7px]'>
                                                    <img src={comment.user_id.profile_picture} alt=""
                                                        className='h-[30px] w-[30px] rounded-full object-cover'
                                                    />
                                                    <div>
                                                        <h2 className='text-white text-[15px] font-bold'>
                                                            {comment.user_id.first_name} {comment.user_id.last_name}
                                                        </h2>
                                                        <p className='text-gray-300 text-[12px] break-all'>
                                                            {comment.comment_text}
                                                        </p>
                                                    </div>
                                                </div>

                                                {comment.user_id._id === state.user._id && (
                                                    <TrashIcon className='text-white h-[19px] cursor-pointer flex-shrink-0'
                                                        onClick={() => handleDel(comment._id)}
                                                    />
                                                )}

                                            </div>
                                        ))}
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

export default CommentsModal;
