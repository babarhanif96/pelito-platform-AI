import React, { useContext, useState } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL, stripePromise } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { CircularProgress } from '@mui/material'
import { calculateEndTime1, getDateFormate } from '../../utils'
import axios from 'axios'
import RatingModal from '../../components/ui/modals/RatingModal'
import TipModal from '../../components/ui/modals/TipModal'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentModal from '../../components/ui/modals/PaymentModal'


const investmentType = ['Upcoming', 'Completed', 'Cancelled']


const MyBookings = () => {

    const stripeKey = loadStripe(stripePromise);

    const queryClient = useQueryClient();

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const [activeType, setactiveType] = useState('Upcoming')
    const [open, setopen] = useState(false)
    const [tipOpen, settipOpen] = useState(false)
    const [paymentOpen, setpaymentOpen] = useState(false)

    const [amount, setamount] = useState('')


    const [bookData, setbookData] = useState('')

    const { data, isLoading } = useQuery({
        queryKey: ['bookings', activeType],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/service/get-booked-booking-service/${state.user._id}?status=${activeType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    const handleCancel = async (id) => {

        const token = localStorage.getItem('token');

        handleStateChange({ loader: 'Canceling Booking' });

        try {
            await axios
                .put(BACKEND_URL + "/service/cancel-booking/" + id, {
                    headers: {
                        authorization: "Bearer " + token,
                        //"Content-Type": "multipart/form-data",
                        // Add any other necessary headers
                    },
                })
                .then(function (response) {

                    queryClient.invalidateQueries('bookings');

                })
                .catch(function (error) {
                    setLoadingCancel(false);
                });
        } catch (error) {
            console.log("Error:", error);
        } finally {
            handleStateChange({ loader: '' });
        }
    };


    return (
        <div className=''>

            {open && (
                <RatingModal open={open} setOpen={setopen} data={bookData} />
            )}

            {tipOpen && (
                <TipModal amount={amount} setamount={setamount} open={tipOpen} setOpen={settipOpen} data={bookData} setpaymentOpen={setpaymentOpen} />
            )}

            {paymentOpen && (
                <Elements
                    stripe={stripeKey}
                >
                    <PaymentModal open={paymentOpen} setOpen={setpaymentOpen}
                        booking_id={bookData._id}
                        amount={Number(Number(amount).toFixed(2))}
                    />
                </Elements>
            )}

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='My Bookings' />

                    <div className='flex justify-center mt-[40px]'>

                        <div className='relative z-0 flex justify-center  items-center h-[52px] px-[7px] rounded-[15px]'
                            style={{
                                background: 'rgba(255,255,255,0.09)'
                            }}
                        >
                            <div className='flex'>
                                {investmentType.map((item, i) => (
                                    <div key={i} >
                                        <div className={` w-[100px] md:w-[200px] `} onClick={() => setactiveType(item)}>
                                            <button className={`rounded-[6px] w-full text-[12px] sm:text-[14px] font-medium h-[34px] ${activeType === item ? 'text-white' : ' text-[#93A4BD]'} `}
                                                style={{
                                                    background: activeType === item && '#009688'

                                                }}
                                            >
                                                {item}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className='flex justify-center items-center h-[300px] sm:h-[400px]'>
                            <CircularProgress sx={{ color: 'white' }} />
                        </div>
                    ) : (
                        <div>
                            {data && data.length > 0 && (
                                <div className='mt-[30px] grid grid-cols-1 sm:grid-cols-2 gap-[20px]'>
                                    {data.map((booking, i) => {

                                        let endTime = calculateEndTime1(
                                            booking.booking_time,
                                            booking.service_id.period
                                        );

                                        return <div key={i}

                                            className=' relative'
                                        >

                                            <div className='bg-[#393A3E] relative z-10 rounded-[15px] p-[15px]'>


                                                <h2 className='text-gray-300 font-semibold font-n text-[12px]'>
                                                    {getDateFormate(booking.day)} | {booking.booking_time + " - " + endTime}
                                                </h2>

                                                <h2 className='text-white font-bold pt-[10px] text-[18px]'>
                                                    {booking.service_id.service_name}

                                                </h2>

                                                <h2 className='text-white font-bold text-[15px]'>

                                                    With{" "}
                                                    {booking.member_id.first_name +
                                                        " " +
                                                        booking.member_id.last_name}
                                                </h2>


                                                <h2 className='text-[#009688] font-bold text-[20px] pt-[5px]'>
                                                    ${booking.orignal_price}
                                                </h2>

                                                {(booking.status === 'booked' || booking.status === 'paid') && (
                                                    <div>
                                                        <div className='flex justify-end pt-[10px]'>
                                                            <button
                                                                onClick={() => handleCancel(booking._id)}
                                                                // disabled={mutation.isPending}
                                                                className='bg-[#009688] text-white font-r font-medium text-[12px] w-[100px] h-[32px]  rounded-[7px]'>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                        <div className='flex justify-end pt-[10px]'>

                                                            <a
                                                                href="pdf/cancellation_policy.pdf"
                                                                download
                                                                className='cursor-pointer text-right font-n text-white text-[12px] font-medium'>
                                                                Cancellation Policy
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {booking.status === 'completed' && (
                                                    <h2
                                                        className='cursor-pointer pt-[10px] font-n text-white text-[12px] font-medium'>
                                                        <span className='underline underline-offset-4' onClick={() => {
                                                            setbookData(booking)
                                                            setopen(true)
                                                        }}>Rate our Service</span> |  <span className='underline underline-offset-4' onClick={() => {
                                                            setbookData(booking)
                                                            settipOpen(true)
                                                        }}>Send Tip</span>
                                                    </h2>
                                                )}

                                            </div>

                                            <div className={`absolute inset-[-1.3px] bg-gradient-to-b ${booking.status === 'canceled' ? 'from-[#F57C00]' : booking.status === 'completed' ? 'from-[#009688]' : 'from-[#FFCF33]'}   to-[#393A3E] rounded-[15px]`} />


                                        </div>
                                    })}
                                </div>
                            )}

                            {data && data.length === 0 && (
                                <div className='flex justify-center items-center h-[300px] sm:h-[400px]'>
                                    <h2 className='text-white font-n font-semibold text-[16px]'>
                                        No Bookings Found
                                    </h2>
                                </div>
                            )}
                        </div>
                    )}

                </div>


            </div>

        </div>
    )
}

export default MyBookings