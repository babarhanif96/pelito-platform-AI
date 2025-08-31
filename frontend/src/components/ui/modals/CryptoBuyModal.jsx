/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material'
import { BACKEND_URL, PRESALE_ABI, PRESALE_ADDRESS, TOKEN_ABI, USDT_TOKEN_ADDRESS } from '../../../constant';
import StatesContext from '../../../context/StatesContext';
import { ethers } from 'ethers';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';


const CryptoBuyModal = ({ open, setOpen }) => {

    const context = useContext(StatesContext)
    const { handleStateChange } = context

    const [amount, setamount] = useState('');
    const [address, setaddress] = useState('');
    const [tokenPrice, settokenPrice] = useState(1);
    const [youReceive, setyouReceive] = useState(0);
    const [loading, setloading] = useState(false);

    const { address: walletAddress } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider("eip155");

    const [isCardActive, setisCardActive] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            handleStateChange({ loader: 'Loading' });

            if (isCardActive) {
                if (!ethers.utils.isAddress(address)) {
                    handleStateChange({ error: 'Please enter a valid address.' });
                    return;
                }

                const data = {
                    address,
                    price: amount,
                    value: Number(youReceive)
                };

                const res = await axios.post(`${BACKEND_URL}/user/payment`, data);
                if (res.data.success) {
                    window.location.href = res.data.session;
                }
            } else {

                if (!walletAddress) {
                    handleStateChange({ error: 'Please connect your wallet first.' });
                    return;
                }

                const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
                const provider = ethersProvider.getSigner();

                const tokenContract = new ethers.Contract(USDT_TOKEN_ADDRESS, TOKEN_ABI, provider);
                const paymentContract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);

                const decimals = 6; // USDT typically has 6 decimals
                const tokenAmount = ethers.utils.parseUnits(amount.toString(), decimals);

                // 1. Check token balance
                const userTokenBalance = await tokenContract.balanceOf(walletAddress);
                if (userTokenBalance.lt(tokenAmount)) {
                    handleStateChange({ error: 'Insufficient USDT balance.' });
                    return;
                }

                // 3. Approve
                const approveTx = await tokenContract.approve(PRESALE_ADDRESS, tokenAmount);
                await approveTx.wait(2);

                // 4. Call contract
                const tx = await paymentContract.buyTokensWithUSDT(amount);
                await tx.wait(1);

                handleStateChange({ success: 'Token Purchase Successful!' });

            }

        } catch (e) {
            console.log(e);
            console.log(e.message)
            console.log(e.response)
            handleStateChange({ error: 'Transaction failed' });
        } finally {
            handleStateChange({ loader: '' });
        }
    };

    useEffect(() => {
        if (amount && tokenPrice) {
            setyouReceive((amount / tokenPrice).toFixed(2));
        } else {
            setyouReceive(0);
        }
    }, [amount, tokenPrice]);


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
                                    Buy With {isCardActive ? 'Card' : 'Crypto'}
                                </h2>
                                <div className='h-[28px] w-[28px] flex-shrink-0 cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
                                    onClick={() => setOpen(false)}
                                >
                                    <XMarkIcon className='h-[14px] text-white' />
                                </div>
                            </div>

                            <div className='w-full rounded-[20px] relative'>
                                <div className="bg-[#141414] relative z-10 rounded-[20px] px-[10px] lg:px-[20px] py-[30px] h-full">

                                    <form onSubmit={handleSubmit} className='mt-[50px] px-[10px] space-y-[15px]'>

                                        {isCardActive && (
                                            <input
                                                className='bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[42px] px-[12px] rounded-[12px]'
                                                placeholder="Recipient's Wallet Address"
                                                value={address}
                                                onChange={(e) => setaddress(e.target.value)}
                                                required
                                            />
                                        )}


                                        <div>
                                            <input
                                                className='bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[42px] px-[12px] rounded-[12px]'
                                                placeholder="Enter Amount in USD"
                                                value={amount}
                                                onChange={(e) => setamount(e.target.value)}
                                                required
                                                type='number'
                                            />

                                            <div className='flex justify-between items-center px-[5px] mt-[5px]'>
                                                <h2 className='font-semibold text-[13px] text-gray-300'>
                                                    You receive
                                                </h2>
                                                <h2 className='font-semibold text-[13px] text-gray-300'>
                                                    {youReceive} Pelito
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
                                                        Pay {amount > 0 && `$${amount}`}
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div>
                                            <h2 className='text-white text-center w-fit mx-auto select-none font-semibold text-[12px] cursor-pointer'
                                                onClick={() => setisCardActive(!isCardActive)}
                                            >
                                                {isCardActive ? 'Buy with Crypto?' : 'Buy with Card?'}
                                            </h2>
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

export default CryptoBuyModal;
