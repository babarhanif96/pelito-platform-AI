/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import StatesContext from '../../../context/StatesContext';
import { CircularProgress, Rating } from '@mui/material';
import InputFeild from '../InputFeild';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';


const RatingModal = ({ open, setOpen, data: rateBooking }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [rating, setrating] = useState(0)
    const [salonRating, setsalonRating] = useState(0)
    const [comment, setcomment] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {

        const token = localStorage.getItem("token");

        let formData = {};
        let formData1 = {};

        formData["salon_id"] = rateBooking.seller_user_id._id;
        formData["user_id"] = state.user._id;
        formData["type"] = "salon";
        formData["rating"] = salonRating;
        formData["text"] = comment;

        formData1["member_id"] = rateBooking.member_id._id;
        formData1["user_id"] = state.user._id;
        formData1["type"] = "member";
        formData1["rating"] = rating;

        setLoading(true);
        try {

            if (salonRating && salonRating > 0) {

                await axios
                    .post(BACKEND_URL + "/rating", formData, {
                        headers: { authorization: "Bearer " + token },
                    })
                    .then(function (response) {
                        handleStateChange({ success: 'Rating added successfully' });
                        setOpen(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setLoading(false);
                    });

            }

            if (rating && rating > 0) {

                await axios
                    .post(BACKEND_URL + "/rating", formData1, {
                        headers: { authorization: "Bearer " + token },
                    })
                    .then(function (response) {
                        setOpen(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }

        } catch (error) {
            setLoading(false);
            console.log("Error:", error);
        } finally {
            setLoading(false);
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
                                    Add Ratings
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

                                        <h2 className='text-white font-n font-semibold text-[17px]'>
                                            Rate{" "}
                                            {rateBooking.member_id.first_name +
                                                " " +
                                                rateBooking.member_id.last_name}
                                        </h2>

                                        <div className=''>
                                            <Rating
                                                value={rating}
                                                onChange={(event, newValue) => setrating(newValue)}
                                                precision={0.5}
                                                style={{
                                                    fontSize: '27px'

                                                }}
                                                sx={{
                                                    '& .MuiRating-iconEmpty': {
                                                        color: '#009688',  // Change color of non-active star
                                                        borderColor: '#009688 !important', // Change border color of non-active star
                                                    },
                                                    marginTop: '-10px'
                                                }}
                                            />
                                        </div>
                                        <h2 className='text-white font-n font-semibold text-[17px]'>
                                            Rate {rateBooking.seller_user_id.salon_name}
                                        </h2>

                                        <div className=''>
                                            <Rating
                                                value={salonRating}
                                                onChange={(event, newValue) => setsalonRating(newValue)}
                                                precision={0.5}
                                                style={{
                                                    fontSize: '27px'

                                                }}
                                                sx={{
                                                    '& .MuiRating-iconEmpty': {
                                                        color: '#009688',  // Change color of non-active star
                                                        borderColor: '#009688 !important', // Change border color of non-active star
                                                    },
                                                    marginTop: '-10px'
                                                }}
                                            />
                                        </div>

                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'Enter your comment'}
                                            value={comment}
                                            onChange={setcomment}

                                        />

                                        <div className='flex justify-end pt-[10px]'>
                                            <button
                                                disabled={loading}
                                                onClick={ () => handleSubmit()}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>
                                                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Submit'}
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

export default RatingModal;
