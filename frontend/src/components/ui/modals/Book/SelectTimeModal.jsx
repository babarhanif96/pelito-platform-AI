/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import StatesContext from '../../../../context/StatesContext';
import DatePicker from "react-horizontal-datepicker";
import axios from 'axios';
import { BACKEND_URL } from '../../../../constant';
import { convertTime } from '../../../../utils';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';




const SelectTimeModal = ({ open, setOpen, selectedData, isAppointment }) => {


    const token = localStorage.getItem('token');

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [slotFullData, setSlotFullData] = useState();
    const [slotData, setSlotData] = useState();
    const [breakData, setBreakData] = useState();
    const [disableData, setDisableData] = useState();
    const [loadingNext, setLoadingNext] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const [checkoutStatus, setCheckoutStatus] = useState(false);
    const [selectedTimeSlotErr, setSelectedTimeSlotErr] = useState(false);
    const [onLeaveStatus, setOnLeaveStatus] = useState(false);
    const [selectedOption, setSelectedOption] = useState("cash");


    const handleDateChange = (date) => {
        setSelectedDate(date);
        setCount(count + 1);
    };

    const selectedDay = async (val) => {
        const currentDate = new Date(val);
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        setSelectedDate(val);
        setCount(count + 1);

        setLoading(true);
        try {
            const response = await axios.get(
                BACKEND_URL +
                "/slot/get-slot-for-customer/" +
                formattedDate +
                "/" +
                selectedData.memberId,
                { headers: { authorization: "Bearer " + token } }
            );
            if (response) {

                console.log(response.data)

                setSlotFullData(response.data);
                setBreakData(response.data.breakTimes);
                setDisableData(response.data.disableSlot);


                // Convert date to string (ISO format) to ensure correct comparison
                const formattedDate = new Date(val).toISOString().split("T")[0];

                // Check if the date already exists
                const isDateExists = response.data.member.unavailable_dates.some(
                    (d) => new Date(d).toISOString().split("T")[0] === formattedDate
                );

                if (isDateExists) {
                    setSlotData([]);
                    setOnLeaveStatus(true);
                } else {
                    const startTime = convertTime(response.data.slot.start_time);
                    const endTime = convertTime(response.data.slot.end_time);

                    const slotArr = calculateSlots(startTime, endTime);
                    const finalSlotArr = [];
                    slotArr.map((slot) => {
                        if (response.data.breakTimes.length > 0) {
                            if (checkBreakHour(slot, response.data.breakTimes)) {
                            } else {
                                finalSlotArr.push(slot);
                            }
                        } else {
                            if (response && response.data && response.data.slot) {
                                finalSlotArr.push(slot);
                            }
                        }
                    });

                    //now check for disabled slots
                    const finalSlotArrAfterDisable = [];
                    finalSlotArr.map((slot) => {
                        if (response.data.disableSlot.length > 0) {
                            if (checkDisableSlot(response.data.disableSlot, slot)) {
                            } else {
                                finalSlotArrAfterDisable.push(slot);
                            }
                        } else {
                            if (response && response.data && response.data.slot) {
                                finalSlotArrAfterDisable.push(slot);
                            }
                        }
                    });

                    setSlotData(finalSlotArrAfterDisable);
                }
                setCount(count + 1);
                setLoading(false);
            }
        } catch (error) {
            setSlotData([]);
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    const checkDisableSlot = (disableDataList, slot_time) => {
        let status = false;
        disableDataList.map((timeString) => {
            const timeArray = timeString.split(", ");

            const startTime = convertTime(timeArray[0]);
            const endTime = convertTime(timeArray[1]);
            const checkTime = convertTime(slot_time);
            const isBetween = checkTime >= startTime && checkTime < endTime;
            if (isBetween === true) {
                status = isBetween;
            }
        });
        return status;
    };

    const checkBreakHour = (slot_time, breakTimes) => {
        let status = false;
        breakTimes.map((breakT) => {
            const startTime = convertTime(breakT.start_time);
            const endTime = convertTime(breakT.end_time);
            const checkTime = convertTime(slot_time);
            const isBetween = checkTime >= startTime && checkTime < endTime;
            if (isBetween === true) {
                status = isBetween;
            }
        });
        return status;
    };

    const calculateSlots = (startTime, endTime) => {
        const timeSlots = [];
        const interval = 30 * 60 * 1000; // 30 minutes in milliseconds

        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            const formattedTime = currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            timeSlots.push(formattedTime);

            currentTime.setTime(currentTime.getTime() + interval);
        }
        return timeSlots;
    };

    const handleNext = async (userInfo, token) => {

        if (isAppointment) {
            if (selectedOption === "cash") {
                handleAdd();
                return
            }
        }

        if (checkoutStatus) {
            navigate("/cart");
        } else {
            if (selectedTimeSlot) {
                try {

                    setLoadingNext(true);

                    var isoDate = new Date(
                        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
                    ).toISOString();

                    let formData = {};

                    if (isAppointment) {
                        formData["customer_user_id"] = selectedData.selectedService.customerId;
                        formData["appointment_ref"] = state.user._id;
                        formData["seller_user_id"] = state.user._id;
                    } else {
                        formData["customer_user_id"] = state.user._id;
                        formData["seller_user_id"] = selectedData.salonId;
                    }

                    formData["service_id"] = selectedData.selectedService._id;
                    formData["price"] = selectedData.selectedService.price;
                    formData["day"] = isoDate;
                    formData["other_charges"] = 0;
                    formData["slot_id"] = slotFullData.slot._id;
                    formData["booking_time"] = selectedTimeSlot;
                    formData["member_id"] = selectedData.memberId;
                    formData["booking_user_type"] = "online";

                    const response = await axios.post(
                        BACKEND_URL + "/service/add-service-booking",
                        formData,
                        {
                            headers: {
                                authorization: "Bearer " + token,
                            },
                        }
                    );
                    if (response) {

                        setLoadingNext(false);
                        handleStateChange({ success: "Service added to cart successfully" });
                        setCheckoutStatus(true);
                        queryClient.invalidateQueries("cart-service");

                        if (isAppointment) {
                            navigate("/cart");
                        }

                    }

                } catch (error) {
                    setLoadingNext(false);
                    console.error("Error fetching data:", error);
                }
                setSelectedTimeSlotErr("");
            } else {
                handleStateChange({ error: "Please select time" });

            }
        }
    };

    const handleSelectTimeSlot = (time) => {
        setSelectedTimeSlot(time);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleAdd = async () => {

        const token = localStorage.getItem("token");

        try {

            setLoadingNext(true);

            var isoDate = new Date(
                selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
            ).toISOString();

            let formData = {};

            formData["customer_user_id"] = selectedData.selectedService.customerId;
            formData["seller_user_id"] = state.user._id;
            formData["service_id"] = selectedData.selectedService._id;
            formData["price"] = selectedData.selectedService.price;
            formData["day"] = isoDate;
            formData["other_charges"] = 0;
            formData["slot_id"] = slotFullData.slot._id;
            formData["booking_time"] = selectedTimeSlot;
            formData["member_id"] = selectedData.memberId;
            formData["booking_user_type"] = "offline";

            const x = await axios.post(
                BACKEND_URL + "/service/add-service-booking",
                formData,
                {
                    headers: {
                        authorization: "Bearer " + token,
                    },
                }
            );

            let cartResponse = await axios.get(
                BACKEND_URL + "/service/get-booking-service/" + selectedData.selectedService.customerId,
                { headers: { authorization: "Bearer " + token } }
            );

            const bookingIds = cartResponse.data.services.map((item) => item._id);
            let formDataNew = {};
            formDataNew["booking_ids"] = bookingIds;

            const response1 = await axios.put(
                BACKEND_URL + "/service/booking-status-for-offline",
                formDataNew,
                {
                    headers: {
                        authorization: "Bearer " + token,
                    },
                }
            );

            if (response1) {
                handleStateChange({ success: "Appointment created successfully" });
                navigate("/professional/appointments");
                queryClient.invalidateQueries("appointments");
                setOpen(false);
            }


        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setLoadingNext(false);
        }

    };


    function bookedDiv() {
        return (
            <div className="text-center flex flex-col h-[100px] justify-center">

                <span className="mt-[20px] text-[16px] block text-white font-bold">
                    {onLeaveStatus
                        ? selectedData.memberName + " is on leave today"
                        : selectedData.memberName + " is fully booked today"}
                </span>
                <span className=" text-white text-[13px]">
                    Please select another date or try with other professionals
                </span>
            </div>
        );
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
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[950px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[900px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[22px]'>
                                    Select Time
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

                                        <div>
                                            <DatePicker
                                                color="#539d90"
                                                onChange={(date) => handleDateChange(date)}
                                                onClick={(date) => handleDateChange(date)}
                                                getSelectedDay={(date) => selectedDay(date)}
                                            />

                                            <div>
                                                {loading ? (
                                                    <div className='h-[100px] flex justify-center items-center'>
                                                        <CircularProgress sx={{ color: 'white' }} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {slotData && slotData.length > 0 ? (
                                                            <div className="inline-block w-full mt-[30px]">
                                                                <>
                                                                    <div className="overflow-auto whitespace-nowrap pb-3">
                                                                        {slotData.map((slot) => {
                                                                            return (
                                                                                <>
                                                                                    <button
                                                                                        onClick={() => handleSelectTimeSlot(slot)}
                                                                                        className={` ${selectedTimeSlot === slot ? "bg-[#009688] border border-transparent" : "border border-gray-500"
                                                                                            } w-auto ml-2 text-white text-left text-[14px]  cursor-pointer mt-2 px-[10px] py-[7px] rounded-[7px] `}
                                                                                    >
                                                                                        {slot}
                                                                                    </button>
                                                                                </>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        {selectedTimeSlotErr ? (
                                                                            <div className="text-red">{selectedTimeSlotErr}</div>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>

                                                                    {isAppointment && (
                                                                        <div className="mt-[15px] flex items-center gap-[15px]">
                                                                            <label className='text-white cursor-pointer font-n font-semibold text-[14px]'>
                                                                                <input
                                                                                    className="mr-[5px] h-[11px] focus:ring-2 focus:ring-black"
                                                                                    type="radio"
                                                                                    value="cash"
                                                                                    checked={selectedOption === "cash"}
                                                                                    onChange={handleOptionChange}
                                                                                />
                                                                                Pay in Cash
                                                                            </label>

                                                                            <label className='text-white cursor-pointer font-n font-semibold text-[14px]'>
                                                                                <input
                                                                                    className="mr-[5px] h-[11px]"
                                                                                    type="radio"
                                                                                    value="online"
                                                                                    checked={selectedOption === "online"}
                                                                                    onChange={handleOptionChange}
                                                                                />
                                                                                Pay Online
                                                                            </label>
                                                                        </div>
                                                                    )}

                                                                    <div className="flex justify-end gap-[20px] mt-[20px]">

                                                                        <>
                                                                            {/* {checkoutStatus ? (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setOpen(false)}
                                                                                    className=' text-gray-400 border border-gray-500 font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[170px] h-[32px] sm:h-[37px] rounded-[7px]'>

                                                                                  
                                                                                </button>
                                                                            ) : (
                                                                                ""
                                                                            )} */}



                                                                            <button
                                                                                type="button"
                                                                                disabled={loadingNext}
                                                                                onClick={() => handleNext(state, token)}
                                                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>


                                                                                {loadingNext ? <CircularProgress size={18} sx={{ color: 'white' }} /> : (
                                                                                    <>
                                                                                        {isAppointment ? 'Proceed' : (
                                                                                            <>
                                                                                                {checkoutStatus ? "Checkout" : "Next"}
                                                                                            </>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </button>

                                                                        </>

                                                                    </div>
                                                                </>
                                                            </div>
                                                        ) : (
                                                            <> {bookedDiv()}</>
                                                        )}
                                                    </>
                                                )}
                                            </div>

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

export default SelectTimeModal;
