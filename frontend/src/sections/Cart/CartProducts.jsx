import { TrashIcon } from '@heroicons/react/24/solid';
import { CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ADMIN_ADDRESS, BACKEND_URL, TOKEN_ABI, TOKEN_ADDRESS, stripePromise } from '../../constant';
import StatesContext from '../../context/StatesContext';
import CusSettingsModal from '../../components/ui/modals/CusSettingsModal';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { Elements } from '@stripe/react-stripe-js';
import PaymentModal from '../../components/ui/modals/PaymentModal';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const CartProducts = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const stripeKey = loadStripe(stripePromise);

    const [tax, setTax] = useState(0);
    const [itemTotal, SetItemTotal] = useState(0);
    const [code, setcode] = useState('')

    const [open, setopen] = useState(false)
    const [shippingName, setshippingName] = useState('d')
    const [isConfirmed, setisConfirmed] = useState(true)
    const [paymentOpen, setpaymentOpen] = useState(false)

    const [couponData, setcouponData] = useState('')
    const { open: modalOpen } = useAppKit();
    const { address } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider("eip155");


    const { data, isLoading } = useQuery({
        queryKey: ['cart-product'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/product/cart-details/${state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });

    const handleDelete = async (id) => {

        const token = localStorage.getItem('token');

        try {

            handleStateChange({ loader: 'Removing' })

            const response = await axios.delete(
                BACKEND_URL + "/product/delete-product-from-cart/" + id,
                { headers: { authorization: "Bearer " + token } }
            );
            if (response) {
                handleStateChange({ success: 'Product removed successfully' })
                queryClient.invalidateQueries('cart-product');
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            handleStateChange({ loader: '' })
        }
    };

    useEffect(() => {

        if (data && data.cart?.length > 0) {

            const taxCal = data.cart.reduce(
                (sum, item) => sum + item.professional_product_fee,
                0
            );
            setTax(taxCal);
            const itemTotal = data.cart.reduce(
                (sum, item) => sum + item.price,
                0
            );
            SetItemTotal(itemTotal);
        }

    }, [data])


    const makeApiCalls = async () => {
        let arr = [];
        for (const apiUrl of data.cart) {
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

                cart_id: apiUrl._id,
                product_amount: apiUrl.price,
                network_fee_amount: apiUrl.professional_product_fee,
                token_platform: "",
                // total_amount: parseInt(
                //   apiUrl.price + apiUrl.professional_product_fee,
                //   10
                // ),
                token_account: "",
            };

            arr.push(transformedItem);
        }
        return arr;
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




  const payWithCrypto = async () => {
    if (!address) {
        modalOpen();
        return;
    }

    const token = localStorage.getItem('token');

    try {
        handleStateChange({ loader: 'Loading' });

        const amount = Number(itemTotal).toFixed(2);
        const taxAmountValue = Number(tax).toFixed(2);
        const discountedAmount = Math.max(amount - (couponData?.data?.totalAmountLeft || 0), 0);

        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const provider = ethersProvider.getSigner();

        const recipientAddress = data.cart[0].seller_user_id.address;
        const adminAddress = ADMIN_ADDRESS;

        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);

        const userBalance = await tokenContract.balanceOf(address);
        const taxAmount = ethers.utils.parseUnits(taxAmountValue.toString(), 6);
        const amountToSeller = ethers.utils.parseUnits(discountedAmount.toString(), 6);

        const totalAmount = parseFloat(discountedAmount) + parseFloat(taxAmountValue);
        const totalTransferAmount = ethers.utils.parseUnits(totalAmount.toString(), 6);

        if (userBalance.lt(totalTransferAmount)) {
            handleStateChange({ error: 'Insufficient token balance' });
            return;
        }

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

        const taxTx = await tokenContract.transfer(adminAddress, taxAmount);
        await taxTx.wait(1);

        let sellerTxHash = null;

        if (discountedAmount > 0) {
            const sellerTx = await tokenContract.transfer(recipientAddress, amountToSeller);
            await sellerTx.wait(1);
            sellerTxHash = sellerTx.hash;
        }

        const apiResults = await makeApiCalls();

        let formData = {
            cart_id_array: apiResults,
            name: shippingName,
            hash: sellerTxHash,
            amount,
            code: code,
        };

        const response = await axios.post(
            BACKEND_URL + "/product/add-payment/crypto",
            formData,
            { headers: { authorization: "Bearer " + token } }
        );

        if (response) {
            queryClient.invalidateQueries('cart-product');
            navigate('/dashboard');
            handleStateChange({ success: 'Product purchased successfully' });
        }

    } catch (e) {
        console.log(e);
        handleStateChange({ error: 'Payment failed' });
    } finally {
        handleStateChange({ loader: '' });
    }
};



    return (
        <div className='mt-[50px]'>

            {paymentOpen && (
                <Elements
                    stripe={stripeKey}
                >

                    <PaymentModal open={paymentOpen} setOpen={setpaymentOpen}
                        cartData={data.cart}
                        page="product"
                        shippingName={shippingName}
                    />

                </Elements>
            )}

            {open && (
                <CusSettingsModal open={open} setOpen={setopen} shippingName={shippingName} setshippingName={setshippingName} isCart={true} setisConfirmed={setisConfirmed} />
            )}

            <h1 className='text-white text-[25px] font-n font-semibold text-center md:text-start'>Cart Products</h1>

            {isLoading ? (
                <div className='flex justify-center items-center h-[200px]'>
                    <CircularProgress sx={{ color: 'white' }} />
                </div>
            ) : (
                <div>
                    {data && data.cart?.length > 0 && (
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-[30px] mt-[20px]'>

                            <div className='md:col-span-2  w-full space-y-[15px]'>
                                {data.cart.map((item, index) => (
                                    <div className='bg-[rgba(225,225,225,0.09)] rounded-[10px] p-[20px] relative' key={index}>



                                        <div className='flex justify-between items-center gap-[20px]'>
                                            <div className='flex items-center gap-[10px]'>

                                                <img src={item.product_id.img_url} alt="" className='w-[100px] h-[50px] rounded-[7px] object-cover' />
                                                <div>
                                                    <h2 className='text-white font-n text-[17px] font-bold'>
                                                        {item.product_id.name}
                                                    </h2>
                                                    <h2 className='text-white font-n text-[12px]'>
                                                        Qty:{item.quantity}
                                                    </h2>

                                                </div>
                                            </div>
                                            <div className='flex items-center gap-[10px] sm:gap-[15px]'>
                                                <h2 className='text-[#009688] font-n text-[22px] font-bold '>
                                                    ${item.product_id.price * item.quantity}
                                                </h2>

                                                <TrashIcon className='text-white h-[20px] mt-[-7px] cursor-pointer'
                                                    onClick={() => {
                                                        handleDelete(
                                                            item._id,

                                                        )
                                                    }}
                                                />

                                            </div>
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

                                <div className='border-t border-b border-gray-600 mt-[20px] sm:mt-[25px] py-[15px] space-y-[10px]'>
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
                                        ${(itemTotal + tax).toFixed(2)}
                                    </h2>
                                </div>

                                <div className='mt-[30px] mb-[10px]'>

                                    {isConfirmed ? (
                                        <div>


                                            {data.isGlobalStripeEnabled && (
                                                <div>
                                                    <button onClick={() => setpaymentOpen(true)} className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'>
                                                        Pay ${Number(itemTotal + tax).toFixed(2)}
                                                    </button>
                                                    <h2 className='text-white text-center text-[12px] py-[10px] font-bold'>
                                                        OR
                                                    </h2>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => payWithCrypto()}
                                                className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'>
                                                Pay with crypto    ${(
                                                    Math.max(itemTotal - (couponData?.data?.totalAmountLeft || 0), 0)
                                                    + tax
                                                ).toFixed(2)}
                                            </button>
                                        </div>
                                    ) : (
                                        <button className='bg-[#009688] w-full text-white text-[14px] font-semibold rounded-[20px] h-[34px]'
                                            onClick={() => setopen(true)}
                                        >
                                            Proceed
                                        </button>
                                    )}




                                </div>

                            </div>
                        </div>
                    )}

                    {data && data.cart?.length === 0 && (
                        <div className='flex justify-center items-center h-[200px]'>
                            <p className='text-white text-[15px] font-n'>Your Cart is empty</p>
                        </div>
                    )}

                </div>

            )
            }


        </div >
    )
}

export default CartProducts