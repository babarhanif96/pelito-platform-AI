/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import StatesContext from '../../../context/StatesContext';
import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../constant';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

import { useNavigate } from "react-router-dom";


const PaymentModal = ({ open, setOpen, cartData, page, shippingName, amount, booking_id }) => {

    const usertoken = localStorage.getItem('token');

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [paymentError, setPaymentError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle the results after all API calls
    const handleApiResults = async (apiResults) => {

        let formData = {};
        if (page === "product") {
            formData["cart_id_array"] = apiResults;
            formData["name"] = shippingName;
        } else {
            formData["booking_id_array"] = apiResults;
        }
        try {
            const response = await axios.post(
                BACKEND_URL + '/' + page + "/add-payment/",
                formData,
                { headers: { authorization: "Bearer " + usertoken } }
            );
            if (response) {
                setLoading(false);
                handleStateChange({ success: page + " booked successfully" });
                queryClient.invalidateQueries('cart-service');
                navigate('/dashboard');
                setOpen(false);
            }
        } catch (error) {
            setLoading(false);
            console.log("Error fetching data:", error);
            handleStateChange({
                error: error && error.response && error.response.message
                    ? error.response.data.message
                    : "Service not booked"
            });
        }
    };

    const executeApiCalls = async () => {
        try {
            const apiResults = await makeApiCalls();
            handleApiResults(apiResults);
        } catch (error) {
            console.error("Error during API calls:", error);
        }
    };

    const makeApiCalls = async () => {
        const results = [];
        let arr = [];
        for (const apiUrl of cartData) {
            const data = await fetchData(apiUrl);
            const data2 = await fetchData(apiUrl);
            let transformedItem = "";
            if (page === "product") {
                transformedItem = {
                    cart_id: apiUrl._id,
                    product_amount: apiUrl.price,
                    network_fee_amount: apiUrl.professional_product_fee,
                    token_platform: data2.token.id,
                    // total_amount: parseInt(
                    //   apiUrl.price + apiUrl.professional_product_fee,
                    //   10
                    // ),
                    token_account: data.token.id,
                };
            } else {

                transformedItem = {
                    booking_id: apiUrl._id,
                    service_amount: apiUrl.orignal_price,
                    token_platform: data2.token.id,
                    network_fee_amount: apiUrl.professional_service_fee,
                    // total_amount: parseInt(
                    //   apiUrl.orignal_price + apiUrl.professional_service_fee,
                    //   10
                    // ),
                    token_account: data.token.id,
                };
            }
            arr.push(transformedItem);

            results.push(data);
        }
        return arr;
    };

    const fetchData = async (url) => {
        const response = await stripe.createToken(elements.getElement(CardElement));
        //const data = await response.json();
        return response;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            handleStateChange({ error: "Please enter card details." });
            return;
        }

        setLoading(true);
        setPaymentError(null);

        try {
            const { token, error } = await stripe.createToken(cardElement);

            if (error) {
                handleStateChange({ error: error.message });
                setLoading(false);
                return;
            }

            if (!token) {
                handleStateChange({ error: "Payment failed. Please try again." });
                setLoading(false);
                return;
            }

            // Proceed with the API calls after getting the token
            await executeApiCalls();
        } catch (error) {
            handleStateChange({ error: "Something went wrong. Please try again." });
            console.log("Payment Error:", error);
        }
    };


    const handleSubmitTip = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            handleStateChange({ error: "Please enter card details." });
            return;
        }

        setLoading(true);
        setPaymentError(null);

        try {
            const { token, error } = await stripe.createToken(cardElement);

            if (error) {
                handleStateChange({ error: error.message });
                setLoading(false);
                return;
            }

            if (!token) {
                handleStateChange({ error: "Payment failed. Please try again." });
                setLoading(false);
                return;
            }

            // Send only the tip amount to the backend
            const tipAmount = Number(amount); // Set your desired tip amount

            await axios.post(
                `${BACKEND_URL}/service/send-tip`, // Adjust the endpoint to match the backend
                {
                    token_account: token.id,
                    service_amount: tipAmount,
                    booking_id
                },
                { headers: { authorization: "Bearer " + usertoken } }
            );

            setLoading(false);
            handleStateChange({ success: "Tip sent successfully!" });
            setOpen(false);

        } catch (error) {
            handleStateChange({ error: "Something went wrong. Please try again." });
            console.log("Payment Error:", error);
            setLoading(false);
        } finally {
            setLoading(false)
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
                                    Checkout
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

                                    <div className='mt-[60px] px-[10px] space-y-[15px] max-h-[400px] overflow-auto'>

                                        <form onSubmit={(e) => {
                                            if (booking_id) {
                                                handleSubmitTip(e)
                                            } else {
                                                handleSubmit(e)
                                            }
                                        }}>
                                            <CardElement
                                                options={{
                                                    style: {
                                                        base: {
                                                            color: "white", // Change text color to white
                                                            fontSize: "16px",
                                                            "::placeholder": {
                                                                color: "#ccc", // Change placeholder color
                                                            },
                                                        },
                                                        invalid: {
                                                            color: "red", // Change invalid input color
                                                        },
                                                    },
                                                }}
                                            />
                                            <div className='pt-[30px]'>
                                                <button
                                                    type='submit'
                                                    disabled={loading}
                                                    className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-full  h-[32px] rounded-[7px]'>
                                                    {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Pay Now'}
                                                </button>
                                            </div>
                                            {paymentError && <div style={{ color: "red" }}>{paymentError}</div>}
                                        </form>

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

export default PaymentModal;
