/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Checkbox, CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { BACKEND_URL } from '../../../../constant';
import StatesContext from '../../../../context/StatesContext';


const timeOptions = [
    "Select",
    "08:00 AM",
    // "08:30 AM",
    "09:00 AM",
    // "09:30 AM",
    "10:00 AM",
    // "10:30 AM",
    "11:00 AM",
    // "11:30 AM",
    "12:00 PM",
    // "12:30 PM",
    "01:00 PM",
    // "01:30 PM",
    "02:00 PM",
    // "02:30 PM",
    "03:00 PM",
    // "03:30 PM",
    "04:00 PM",
    // "04:30 PM",
    "05:00 PM",
    // "05:30 PM",
    "06:00 PM",
    // "06:30 PM",
    "07:00 PM",
    // "07:30 PM",
    "08:00 PM",
    // "08:30 PM",
    "09:00 PM",
    // "09:30 PM",
    "10:00 PM",
    // "10:30 PM",
    "11:00 PM",
];


const MemberShiftModal = ({ open, setOpen, memberId }) => {

    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [loading, setLoading] = useState(false);

    const [shiftData, setShiftData] = useState();

    const [formDataAdv, setFormDataAdv] = useState({
        startTimeMonday: "Select", //"08:00 AM",
        endTimeMonday: "Select", //"08:00 PM", // "",
        startTimeTuesday: "Select", //"08:00 AM",
        endTimeTuesday: "Select", //"08:00 PM", // "",
        startTimeWednesday: "Select", //"08:00 AM",
        endTimeWednesday: "Select", //"08:00 PM", // "",
        startTimeThursday: "Select", //"08:00 AM",
        endTimeThursday: "Select", //"08:00 PM", // "",
        startTimeFriday: "Select", //"08:00 AM",
        endTimeFriday: "Select", //"08:00 PM", // "",
        startTimeSaturday: "Select", //"08:00 AM",
        endTimeSaturday: "Select", //"08:00 PM", // "",
        startTimeSunday: "Select", //"08:00 AM",
        endTimeSunday: "Select", //"08:00 PM", // "",
    });

    const [errors, setErrors] = useState({});

    const [dayStatus, setDayStatus] = useState({
        Monday: "on",
        Tuesday: "on",
        Wednesday: "on",
        Thursday: "on",
        Friday: "on",
        Saturday: "on",
        Sunday: "on",
    });

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


    useEffect(() => {
        fetchDataShift();
    }, []);

    const fetchDataShift = async () => {
        try {
            const response = await axios.get(
                BACKEND_URL + "/slot/shift-for-member/" + memberId,
                { headers: { authorization: "Bearer " + token } }
            );
            if (response) {
                let dayTime = {};
                setShiftData(response.data);
                dayArr.forEach((day) => {
                    const index = response.data.findIndex(
                        (user) => user.shift_day === day
                    );
                    if (index >= 0) {
                        if (
                            response.data[index].on_off &&
                            response.data[index].on_off === "off"
                        ) {
                            setDayStatus((prevSchedule) => ({
                                ...prevSchedule,
                                [day]: response.data[index].on_off,
                            }));
                        } //else {
                        let name = "startTime" + day;
                        let nameEnd = "endTime" + day;
                        dayTime[name] = response.data[index].start_time;
                        dayTime[nameEnd] = response.data[index].end_time;

                        setFormDataAdv((prevSchedule) => ({
                            ...prevSchedule,
                            [name]: dayTime[name],
                        }));

                        setFormDataAdv((prevSchedule) => ({
                            ...prevSchedule,
                            [nameEnd]: dayTime[nameEnd],
                        }));
                        // }
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const dayArr = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const handleStartTimeChangeAdv = (e, day) => {
        // const { name, value } = e.target;
        const name = e.name + day;
        setFormDataAdv({ ...formDataAdv, [name]: e.value });
    };

    const getTimeValue = (type, dayName) => {
        let name = type + dayName;
        return formDataAdv[name];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {};
        let dataEdit = {};
        let advc = [];
        let advcEdit = [];

        dayArr.forEach((day) => {
            let advDay = {};
            if (formDataAdv["startTime" + day] && formDataAdv["endTime" + day]) {
                advDay["salon_id"] = state.user._id;
                advDay["member_id"] = memberId;

                advDay["start_time"] = formDataAdv["startTime" + day];
                advDay["end_time"] = formDataAdv["endTime" + day];
                const shiftday = shiftData.findIndex((user) => user.shift_day === day); //check if entry already exist then update it

                if (shiftday > -1) {
                    // if true then add it into update Array
                    advDay["slot_day"] = day;
                    advDay["shift_id"] = shiftData[shiftday]._id;
                    advcEdit.push(advDay);
                } else {
                    // if false then add it to Add array
                    advDay["shift_day"] = day;
                    advc.push(advDay);
                }
            }
        });
        data["data"] = advc;
        dataEdit["data"] = advcEdit;
        //return true;
        if (advc.length > 0) {
            //add
            try {
                await axios
                    .post(BACKEND_URL + "/slot/add-slot", data, {
                        headers: { authorization: "Bearer " + token },
                    })
                    .then(function (response) {
                        handleStateChange({ success: "Time Slot updated successfully" });
                        setLoading(false);
                        setOpen(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
                console.error("Error:", error);
            }
        }

        if (advcEdit.length > 0) {
            //edit
            try {
                await axios
                    .put(BACKEND_URL + "/slot/shift-for-member", dataEdit, {
                        headers: { authorization: "Bearer " + token },
                    })
                    .then(function (response) {
                        setLoading(false);
                        setOpen(false);
                        handleStateChange({ success: "Time Slot updated successfully" });
                    })
                    .catch(function (error) {
                        console.log(error);
                        setOpen(false);
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
                console.error("Error:", error);
            }
        }

        setLoading(false);
    };


    const handleOnOff = async (e, day) => {

        const isChecked = e.target.checked; // Get the checked state of the checkbox
        setDayStatus({ ...dayStatus, [day]: isChecked ? "on" : "off" }); // Set dayStatus based on isChecked

        let data = {};
        data["member_id"] = memberId;
        data["day"] = day;
        data["on_off"] = isChecked ? "on" : "off";

        setLoading(true);

        try {
            await axios
                .put(BACKEND_URL + "/working-hours/set-on-off", data, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    setLoading(false);
                    handleStateChange({ success: day + " updated successfully" });
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    };


    function switchOnOff(dayName) {
        return (
            <div
                className={` col-span-1 inline-block`}
            >

                <Checkbox
                    {...label}
                    checked={dayStatus[dayName] === "on"}
                    onClick={(e) => handleOnOff(e, dayName)}
                    size='small'
                    sx={{
                        color: '#009688',
                        '&.Mui-checked': {
                            color: '#009688',
                        },

                    }}
                />
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
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[750px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[700px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[22px]'>
                                    Set Regular Shift
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

                                        <div className='flex justify-end'>
                                            <h2 className='text-white font-bold font-r text-[14px]'>
                                                Day On/Off
                                            </h2>
                                        </div>

                                        <form onSubmit={(e) => handleSubmit(e)} >
                                            {dayArr.map((dayName) => {
                                                return (
                                                    <div className="flex items-center space-y-[10px] justify-between">

                                                        <div className=" w-[86px]">
                                                            <label htmlFor="startTime" className="text-white font-r font-semibold text-[14px] ">
                                                                {dayName} :
                                                            </label>

                                                        </div>
                                                        <div className="flex items-center gap-[15px]">
                                                            <label htmlFor="startTime" className="text-white hidden sm:block font-r font-semibold text-[12px]">
                                                                Start Time :
                                                            </label>
                                                            <select
                                                                name="startTime"
                                                                className=" bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-[80px] h-[30px] px-[3px] rounded-[7px] max-h-[100px] overflow-y-auto"
                                                                id="startTime"
                                                                value={getTimeValue("startTime", dayName)}
                                                                onChange={(e, day) =>
                                                                    handleStartTimeChangeAdv(e.target, dayName)
                                                                }
                                                            >
                                                                {timeOptions.map((time, index) => (
                                                                    <option key={index} value={time} className='bg-[#242424] text-white text-left'>
                                                                        {time}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {errors.startTime && (
                                                                <span className="text-red text-xs block">
                                                                    {errors.startTime}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="">
                                                            <div className="flex items-center gap-[15px]">
                                                                <label htmlFor="endTime" className="text-white  hidden sm:block font-r font-semibold text-[12px]">
                                                                    End Time :
                                                                </label>
                                                                <select
                                                                    name="endTime"
                                                                    className=" bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-[80px] h-[30px] px-[3px] rounded-[7px]"
                                                                    id="endTime"
                                                                    value={getTimeValue("endTime", dayName)}
                                                                    //onChange={handleStartTimeChangeAdv}
                                                                    onChange={(e, day) =>
                                                                        handleStartTimeChangeAdv(e.target, dayName)
                                                                    }
                                                                >
                                                                    {timeOptions.map((time, index) => (
                                                                        <option key={index} value={time} className='bg-[#242424] text-white text-left'>
                                                                            {time}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {errors.endTime && (
                                                                    <span className="text-red text-xs block">
                                                                        {errors.endTime}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            {switchOnOff(dayName)}
                                                        </div>

                                                    </div>
                                                );
                                            })}

                                            <div className='flex justify-end pt-[30px]'>
                                                <button
                                                    type='submit'
                                                    disabled={loading}
                                                    className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px]  h-[32px] rounded-[7px]'>
                                                    {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Update'}
                                                </button>
                                            </div>

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

export default MemberShiftModal;
