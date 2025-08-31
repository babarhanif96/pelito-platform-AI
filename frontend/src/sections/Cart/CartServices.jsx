import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react'
import { ADMIN_ADDRESS, BACKEND_URL, TOKEN_ABI, TOKEN_ADDRESS, stripePromise } from '../../constant';
import StatesContext from '../../context/StatesContext';
import { CircularProgress } from '@mui/material';
import { getDateFormate } from '../../utils';
import CancelPolicyModal from '../../components/ui/modals/CancelPolicyModal';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import RecurringModal from '../../components/ui/modals/RecurringModal';
import PaymentModal from '../../components/ui/modals/PaymentModal';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';


const CartServices = () => {

    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const stripeKey = loadStripe(stripePromise);

    const { open: modalOpen } = useAppKit();
    const { address } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider("eip155");

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const [tax, setTax] = useState(0);
    const [itemTotal, SetItemTotal] = useState(0);
    const [code, setcode] = useState('')

    const [open, setopen] = useState(false)
    const [policy, setpolicy] = useState('')
    const [bookingId, setbookingId] = useState('')
    const [paymentOpen, setpaymentOpen] = useState(false)
    const [couponData, setcouponData] = useState('')

    const [openRecurring, setopenRecurring] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['cart-service'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/service/get-booking-service/${state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });

    const handleDelete = async (id, bookingId, SlotId) => {

        const token = localStorage.getItem('token');

        try {

            handleStateChange({ loader: 'Removing' })

            const response = await axios.delete(
                BACKEND_URL + "/service/booking-service/" + id + "/" + SlotId,
                { headers: { authorization: "Bearer " + token } }
            );
            if (response) {
                handleStateChange({ success: 'Service removed successfully' })
                queryClient.invalidateQueries('cart-service');
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            handleStateChange({ loader: '' })
        }
    };

    const makeApiCalls = async () => {
        let arr = [];
        for (const apiUrl of data.services) {
            let transformedItem = "";

            transformedItem = {
                booking_id: apiUrl._id,
                service_amount: apiUrl.orignal_price,
                token_platform: "",
                network_fee_amount: apiUrl.professional_service_fee,
                // total_amount: parseInt(
                //   apiUrl.orignal_price + apiUrl.professional_service_fee,
                //   10
                // ),
                token_account: "",
            };

            arr.push(transformedItem);
        }
        return arr;
    };


    const payWithCrypto = async (amount, tax) => {
        const token = localStorage.getItem('token');

        try {
            handleStateChange({ loader: 'Loading' });

            const discountedAmount = Math.max(amount - (couponData?.data?.totalAmountLeft || 0), 0);

            const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
            const provider = ethersProvider.getSigner();

            const recipientAddress = data.services[0].seller_user_id.address;
            const adminAddress = ADMIN_ADDRESS;

            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);

            const userBalance = await tokenContract.balanceOf(address);
            const taxAmount = ethers.utils.parseUnits(tax.toString(), 6);
            const amountToSeller = ethers.utils.parseUnits(discountedAmount.toString(), 6);

            // Calculate total needed
            const totalAmount = parseFloat(discountedAmount) + parseFloat(tax);
            const totalTransferAmount = ethers.utils.parseUnits(totalAmount.toString(), 6);

            if (userBalance.lt(totalTransferAmount)) {
                handleStateChange({ error: 'Insufficient token balance' });
                return;
            }

            // Estimate gas for needed transfers
            const gasPrice = await ethersProvider.getGasPrice();
            let gasFee = ethers.BigNumber.from(0);

            const gasLimitTax = await tokenContract.estimateGas.transfer(adminAddress, taxAmount);
            gasFee = gasFee.add(gasLimitTax.mul(gasPrice));

            let gasLimitSeller = ethers.BigNumber.from(0);
            if (discountedAmount > 0) {
                gasLimitSeller = await tokenContract.estimateGas.transfer(recipientAddress, amountToSeller);
                gasFee = gasFee.add(gasLimitSeller.mul(gasPrice));
            }

            const userEthBalance = await ethersProvider.getBalance(address);
            if (userEthBalance.lt(gasFee)) {
                handleStateChange({ error: 'Insufficient ETH for gas fees' });
                return;
            }

            // === 🧾 PROCESS PAYMENTS ===

            // Always transfer tax
            const taxTx = await tokenContract.transfer(adminAddress, taxAmount);
            await taxTx.wait(1);

            let sellerTxHash = null;

            // If discountedAmount > 0, pay seller
            if (discountedAmount > 0) {
                const sellerTx = await tokenContract.transfer(recipientAddress, amountToSeller);
                await sellerTx.wait(1);
                sellerTxHash = sellerTx.hash;
            }

            const apiResults = await makeApiCalls();

            let formData = {
                booking_id_array: apiResults,
                hash: sellerTxHash, // null if no seller payment
                amount,
                code: code
            };

            const response = await axios.post(
                BACKEND_URL + "/service/add-payment/crypto",
                formData,
                { headers: { authorization: "Bearer " + token } }
            );

            if (response) {
                queryClient.invalidateQueries('cart-service');
                navigate('/dashboard');
                handleStateChange({ success: 'Service booked successfully' });
            }

        } catch (e) {
            console.log(e);
            handleStateChange({ error: 'Payment failed' });
        } finally {
            handleStateChange({ loader: '' });
        }
    };




    const ApplyCoupon = async () => {

        if (!code) {
            handleStateChange({ error: 'Please enter a coupon code' });
            return;
        }

        try {
            handleStateChange({ loader: 'Applying coupon' });

            const data = await axios.get(
                BACKEND_URL + `/gift/verify?code=${code}`,
            );

            setcouponData(data.data);

            handleStateChange({ success: 'Coupon applied successfully' });


        } catch (error) {
            console.log("Error applying coupon:", error);
            handleStateChange({ error: error.response.data.message });
        } finally {
            handleStateChange({ loader: '' });
        }
    }


    useEffect(() => {

        if (data && data.services?.length > 0) {

            const taxCal = data.services.reduce((sum, item) => sum + item.tax, 0);
            setTax(taxCal);
            const itemTotal = data.services.reduce(
                (sum, item) => sum + item.orignal_price,
                0
            );
            SetItemTotal(itemTotal);
        }

    }, [data])


    console.log(couponData);

    return (
        <div className='mt-[50px]'>

            {open && (
                <CancelPolicyModal open={open} setOpen={setopen} policy={policy} />
            )}

            {openRecurring && (
                <Elements
                    stripe={stripeKey}


                >
                    <RecurringModal open={openRecurring} setOpen={setopenRecurring} bookingId={bookingId} />

                </Elements>
            )}

            {paymentOpen && (
                <Elements
                    stripe={stripeKey}


                >
                    <PaymentModal open={paymentOpen} setOpen={setpaymentOpen}
                        cartData={data.services}
                        page="service"
                    />
                </Elements>
            )}

            <h1 className='text-white text-[25px] font-n font-semibold text-center md:text-start'>Cart Services</h1>

            {isLoading ? (
                <div className='flex justify-center items-center h-[200px]'>
                    <CircularProgress sx={{ color: 'white' }} />
                </div>
            ) : (
                <div>
                    {data && data.services?.length > 0 && (
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-[30px] mt-[20px]'>

                            <div className='md:col-span-2  w-full space-y-[15px]'>
                                {data.services.map((item, index) => (
                                    <div className='bg-[rgba(225,225,225,0.09)] rounded-[10px] p-[20px] relative' key={index}>

                                        <div className='absolute bottom-[15px] right-[10px]'>
                                            <TrashIcon className='text-white h-[20px] cursor-pointer'
                                                onClick={() => {
                                                    handleDelete(
                                                        item._id,
                                                        item.booking_id,
                                                        item.slot_id
                                                    )
                                                }}
                                            />
                                        </div>

                                        <div className='flex justify-between items-center gap-[20px]'>
                                            <div>
                                                <h2 className='text-white font-n text-[17px] font-bold'>
                                                    {item.service_id.service_name}
                                                </h2>
                                                <h2 className='text-white font-n text-[12px]'>
                                                    {item.service_id.description}
                                                </h2>
                                                <h2 className='text-white  sm:hidden font-n text-[12px]'>
                                                    {getDateFormate(item.day)} |{" "}
                                                    {item.booking_time} | {item.service_id.period}
                                                    Min
                                                </h2>
                                            </div>
                                            <div>
                                                <h2 className='text-[#009688] text-right font-n text-[17px] font-bold'>
                                                    ${item.service_id.price}
                                                </h2>
                                                <h2 className='text-white hidden sm:block font-n text-[12px]'>
                                                    {getDateFormate(item.day)} |{" "}
                                                    {item.booking_time} | {item.service_id.period}
                                                    Min
                                                </h2>
                                            </div>
                                        </div>
                                        <div className='mt-[15px] sm:mt-[10px]'>
                                            <button
                                                onClick={() => {
                                                    setopenRecurring(true)
                                                    setbookingId(item._id)
                                                }}
                                                className='bg-[#009688] w-[153px] text-white text-[12px] font-semibold rounded-[7px] h-[26px]'>
                                                Recurring Appointment
                                            </button>

                                            <h2 className='text-[#009688] pt-[15px] sm:pt-[10px] font-n text-[12px] font-bold'>
                                                <a
                                                    href="pdf/recurring_guidlines.pdf"
                                                    download
                                                    className='cursor-pointer'>Recurring Guidelines</a>  | <span className='cursor-pointer'
                                                        onClick={() => {
                                                            setpolicy(item.seller_user_id.cancellation_policy)
                                                            setopen(true)
                                                        }}
                                                    >Cancellation Policy</span>
                                            </h2>
                                        </div>

                                    </div>
                                ))}
                            </div>


                            <div className='bg-[rgba(225,225,225,0.09)] rounded-[10px] p-[20px] w-full md:h-fit'>
                                <h2 className='text-[#009688] text-center font-r font-bold text-[23px] sm:text-[20px]'>
                                    Payment summary
                                </h2>

                                <div className='mt-[10px] flex gap-[5px] items-center'>
                                    <input
                                        className='bg-[rgba(225,225,225,0.08)] outline-none text-white text-[11px] w-full h-[30px] px-[12px] rounded-[10px]'
                                        placeholder="Enter Coupon Code"
                                        value={code}
                                        onChange={(e) => setcode(e.target.value)}
                                    />
                                    <button
                                        className='bg-[#009688] w-[70px] text-white text-[11px] font-semibold rounded-[10px] h-[30px]'
                                        onClick={() => ApplyCoupon()}
                                    >
                                        Apply
                                    </button>

                                </div>

                                <div className='border-t border-b border-gray-600 mt-[20px] py-[15px] space-y-[10px]'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-white font-bold text-[14px]'>
                                            Items Total
                                        </h2>
                                        <h2 className='text-white text-[14px]'>
                                            ${itemTotal}
                                        </h2>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-white font-bold text-[14px]'>
                                            Network Fees
                                        </h2>
                                        <h2 className='text-white text-[14px]'>
                                            ${tax}
                                        </h2>
                                    </div>
                                    {couponData && (
                                        <div className='flex justify-between items-center'>
                                            <h2 className='text-white font-bold text-[14px]'>
                                                Coupon Balance
                                            </h2>
                                            <h2 className='text-white text-[14px]'>
                                                {couponData.data.totalAmountLeft} Pelito
                                            </h2>
                                        </div>
                                    )}
                                </div>

                                <div className='flex justify-between items-center mt-[10px]'>
                                    <h2 className='text-white font-bold text-[14px]'>
                                        Amount to pay
                                    </h2>
                                    <h2 className='text-white text-[14px]'>
                                        ${(
                                            itemTotal
                                            + tax
                                        ).toFixed(2)}
                                    </h2>

                                </div>

                                <div className='mt-[30px] mb-[10px]'>

                                    {data.isGlobalStripeEnabled && (
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setpaymentOpen(true)
                                                }}
                                                className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'>
                                                Pay ${Number(itemTotal + tax).toFixed(2)}
                                            </button>
                                            <h2 className='text-white text-center text-[12px] py-[10px] font-bold'>
                                                OR
                                            </h2>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            if (!address) {
                                                modalOpen()
                                                return
                                            }

                                            payWithCrypto(Number(itemTotal).toFixed(2), Number(tax).toFixed(2))
                                        }}
                                        className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'>
                                        Pay with crypto    ${(
                                            Math.max(itemTotal - (couponData?.data?.totalAmountLeft || 0), 0)
                                            + tax
                                        ).toFixed(2)}
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {data && data.services?.length === 0 && (
                        <div className='flex justify-center items-center h-[200px]'>
                            <p className='text-white text-[15px] font-n'>Your Cart is empty</p>
                        </div>
                    )}

                </div>

            )}


        </div>
    )
}

export default CartServices