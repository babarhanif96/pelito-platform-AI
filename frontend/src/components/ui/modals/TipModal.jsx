/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import StatesContext from '../../../context/StatesContext';
import InputFeild from '../InputFeild';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { TOKEN_ABI, TOKEN_ADDRESS } from '../../../constant';
import { ethers } from 'ethers';


const TipModal = ({ open, setOpen, data: rateBooking, amount, setamount, setpaymentOpen }) => {

    const { open: modalOpen } = useAppKit();
    const { address } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider("eip155");

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [loading, setLoading] = useState(false)


    const payWithCrypto = async () => {

        if (!amount) return

        if (!address) {
            modalOpen()
            return
        }

        try {

            setLoading(true);

            const ethersProvider = new ethers.providers.Web3Provider(
                walletProvider
            );
            const provider = ethersProvider.getSigner();

            const recipientAddress = rateBooking.seller_user_id.address;

            // Create ERC20 token contract instance
            const tokenContract = new ethers.Contract(
                TOKEN_ADDRESS,
                TOKEN_ABI,
                provider
            );

            const userBalance = await tokenContract.balanceOf(address);

            const transferAmount = ethers.utils.parseUnits(amount.toString(), 6); // Adjust decimals for your token

            if (userBalance.lt(transferAmount)) {
                handleStateChange({ error: 'Insufficient token balance' })
                return;
            }

            // Transfer tokens
            const tx = await tokenContract.transfer(recipientAddress, transferAmount);
            await tx.wait(1);

            handleStateChange({ success: 'Tip sent successfully!' })
            setOpen(false)

        } catch (e) {
            console.log(e);
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
                                    Send Tip
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

                                        <InputFeild
                                            isSetting={true}
                                            placeholder={'Enter amount'}
                                            onChange={setamount}
                                            type={'number'}

                                        />

                                        <div className=''>
                                            {rateBooking.seller_user_id.IsStripeEnabled && (
                                                <button className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'
                                                    onClick={() => {
                                                        if (!amount) return

                                                        setpaymentOpen(true)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    Pay ${Number(amount).toFixed(2)}
                                                </button>
                                            )}
                                            {rateBooking.seller_user_id.IsStripeEnabled && (

                                                <h2 className='text-white text-center text-[12px] py-[10px] font-bold'>
                                                    OR
                                                </h2>
                                            )}
                                            <button
                                                onClick={() => payWithCrypto()}
                                                disabled={loading}
                                                className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'>
                                                {loading ? <CircularProgress sx={{ color: 'white' }} size={17} /> : 'Pay with crypto'}
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

export default TipModal;
