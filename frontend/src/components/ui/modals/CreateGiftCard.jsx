/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material'
import { BACKEND_URL, RPC_URL, TOKEN_ABI, TOKEN_ADDRESS } from '../../../constant';
import StatesContext from '../../../context/StatesContext';
import { ethers } from 'ethers';
import { useQueryClient } from '@tanstack/react-query';


const CreateGiftCardModal = ({ open, setOpen }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const [amount, setamount] = useState('');
    const [loading, setloading] = useState(false);
    const [balance, setbalance] = useState(0)


    const handleSumbit = async (e) => {
        e.preventDefault();
        try {
            handleStateChange({ loader: 'Creating gift card' });

            if (amount <= 0) {
                handleStateChange({ error: 'Amount must be greater than 0' });
                return;
            }

            const data = {
                amount
            };

            const token = localStorage.getItem('token');

            await axios.post(`${BACKEND_URL}/gift/create`,
                data, // body data
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            setOpen(false);
            handleStateChange({ success: 'Gift card created successfully!' });
            queryClient.invalidateQueries('giftCards');


        } catch (e) {
            console.log(e);
            handleStateChange({ error: e.response?.data?.message || 'An error occurred while creating the gift card.' });
        } finally {
            handleStateChange({ loader: '' });

        }
    };



    const FetchBalance = async () => {


        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

        // Create contract instance
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
        const value = await tokenContract.balanceOf(state.user.address)

        setbalance(Number((ethers.utils.formatUnits(value.toString(), 6).toString())));

    }


    useEffect(() => {
        FetchBalance()
    }, [])


    return (
        <div>
            {open && (
                <div className="fixed top-0 left-0 w-full h-full z-50" style={{ background: 'rgba(0, 0, 0, 0.4)' }}></div>
            )}

            {open && (
                <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px]">
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[500px] mx-auto'>

                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center gap-[20px] right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] font-bold font-r text-[15px] sm:text-[22px]'>
                                    Create Gift Card
                                </h2>
                                <div className='h-[28px] w-[28px] flex-shrink-0 cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
                                    onClick={() => setOpen(false)}
                                >
                                    <XMarkIcon className='h-[14px] text-white' />
                                </div>
                            </div>

                            <div className='w-full rounded-[20px] relative'>
                                <div className="bg-[#141414] relative z-10 rounded-[20px] px-[10px] lg:px-[20px] py-[30px] h-full">

                                    <form onSubmit={handleSumbit} className='mt-[50px] px-[10px] space-y-[15px]'>

                                        <div className='py-[10px]'>
                                            <input
                                                className='bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[42px] px-[12px] rounded-[12px]'
                                                placeholder="Enter Token Amount"
                                                value={amount}
                                                onChange={(e) => setamount(e.target.value)}
                                                required
                                                type='number'
                                            />

                                            <div className='flex justify-between items-center px-[5px] mt-[5px]'>
                                                <h2 className='font-semibold text-[12px] text-gray-300'>
                                                    Available Tokens
                                                </h2>
                                                <h2 className='font-semibold text-[12px] text-gray-300'>
                                                    {balance.toFixed(2)} Pelito
                                                </h2>
                                            </div>
                                        </div>

                                        <div className='flex justify-end pt-[10px]'>
                                            <button
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-full h-[38px] rounded-[7px]'
                                                type='submit'
                                                disabled={loading}
                                            >
                                                {loading ? <CircularProgress sx={{ color: 'white' }} size={17} /> : (
                                                    <>
                                                        Create
                                                    </>
                                                )}
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

export default CreateGiftCardModal;
