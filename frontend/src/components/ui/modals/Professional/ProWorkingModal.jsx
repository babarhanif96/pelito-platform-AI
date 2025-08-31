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


const ProfWorkingModal = ({ open, setOpen, data: hours }) => {

    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [loading, setLoading] = useState(false);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


    const [formDataAdv, setFormDataAdv] = useState({
        startTimeMonday: "10:00 AM",
        endTimeMonday: "07:00 PM",
        startTimeTuesday: "10:00 AM",
        endTimeTuesday: "07:00 PM",
        startTimeWednesday: "10:00 AM",
        endTimeWednesday: "07:00 PM",
        startTimeThursday: "10:00 AM",
        endTimeThursday: "07:00 PM",
        startTimeFriday: "10:00 AM",
        endTimeFriday: "07:00 PM",
        startTimeSaturday: "10:00 AM",
        endTimeSaturday: "07:00 PM",
        startTimeSunday: "10:00 AM",
        endTimeSunday: "07:00 PM",
    });

    const [errors, setErrors] = useState({});
    const [errorTime, setErrorTime] = useState("");

    useEffect(() => {
        setData();
    }, []);

    const setData = () => {
        if (hours && hours.length > 0) {
            let dayTime = {};
            dayArr.forEach((day) => {
                const index = hours.findIndex((user) => user.day === day);
                if (index >= 0) {
                    let name = "startTime" + day;
                    let nameEnd = "endTime" + day;

                    const timeString = hours[index].time; //"10:00 AM - 07:00 PM";

                    // Using regular expression to extract start and end times
                    const regex = /(\d{2}:\d{2} [APMapm]+)/g;
                    const [startTime, endTime] = timeString.match(regex);
                    dayTime[name] = startTime;
                    dayTime[nameEnd] = endTime;

                    setFormDataAdv((prevSchedule) => ({
                        ...prevSchedule,
                        [name]: dayTime[name],
                    }));

                    setFormDataAdv((prevSchedule) => ({
                        ...prevSchedule,
                        [nameEnd]: dayTime[nameEnd],
                    }));
                }
            });
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

    const getTimeValue = (type, dayName) => {
        let name = type + dayName;
        return formDataAdv[name];
    };

    const handleStartTimeChangeAdv = (e, day) => {
        // const { name, value } = e.target;
        const name = e.name + day;
        setFormDataAdv({ ...formDataAdv, [name]: e.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let dataEdit = {};

        dayArr.forEach(async (day) => {
            let status = "add";
            let advDay = {};
            const shiftday = hours
                ? hours.findIndex((user) => user.day === day)
                : "-1"; //check if entry already exist then update it
            if (formDataAdv["startTime" + day] && formDataAdv["endTime" + day]) {
                advDay["time"] =
                    formDataAdv["startTime" + day] + " - " + formDataAdv["endTime" + day];

                if (shiftday > -1) {
                    // if true then add it into update Array
                    // advDay["day"] = day;
                    // advcEdit.push(advDay);
                    dataEdit = {
                        day: day,
                        time:
                            formDataAdv["startTime" + day] +
                            " - " +
                            formDataAdv["endTime" + day],
                    };
                    status = "edit";
                    await editHour(dataEdit, hours[shiftday]._id);
                } else {
                    // if false then add it to Add array
                    advDay["user_id"] = state.user._id;
                    advDay["day"] = day;
                    await addHour(advDay);
                }
            }

            //dataEdit = advcEdit;

            if (advDay && status === "add") {
                //add
                await addHour(advDay);
            }
            // if (advcEdit.length > 0 && status === "edit") {
            //   //edit
            //   editHour(dataEdit, hours[shiftday]._id);
            // }
        });

        handleStateChange({ success: "Time updated successfully" });
        setOpen(false);
        setLoading(false);
        queryClient.invalidateQueries("time");
    };

    const addHour = async (data) => {
        try {
            await axios
                .post(BACKEND_URL + "/working-hours", data, {
                    headers: { authorization: "Bearer " + token },
                })

        } catch (error) {
            console.log("Error:", error);
        }
    };

    const editHour = async (dataEdit, id) => {
        try {
            await axios
                .put(BACKEND_URL + "/working-hours/" + id, dataEdit, {
                    headers: { authorization: "Bearer " + token },
                })

        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleDaysChange = async (e, dayName) => {

        try {

            handleStateChange({ loader: 'Updating' })

            await axios
                .put(BACKEND_URL + "/user/off-days", { user_id: state.user._id, name: dayName }, {
                    headers: { authorization: "Bearer " + token },
                })

            queryClient.invalidateQueries("user");

            
            setTimeout(() => {
                handleStateChange({ loader: '' })
                handleStateChange({ success: 'Days updated successfully' })
            }, 2000);

        } catch (error) {
            console.log("Error:", error);
        }

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
                                    Set Contact Hours
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

                                                        <Checkbox
                                                            {...label}
                                                            checked={!state.user.offDays.includes(dayName)}
                                                            onClick={(e) => handleDaysChange(e, dayName)}
                                                            size='small'
                                                            sx={{
                                                                color: '#009688',
                                                                '&.Mui-checked': {
                                                                    color: '#009688',
                                                                },

                                                            }}
                                                        />

                                                        {errorTime && (
                                                            <p
                                                                style={{
                                                                    display: "block",
                                                                    color: "red",
                                                                    marginTop: "10px",
                                                                }}
                                                            >
                                                                {errorTime}
                                                            </p>
                                                        )}
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

export default ProfWorkingModal;
