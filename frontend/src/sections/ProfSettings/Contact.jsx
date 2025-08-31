import { PencilSquareIcon } from '@heroicons/react/24/solid'
import React, { useContext, useEffect, useState } from 'react'
import StatesContext from '../../context/StatesContext'
import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'
import ProfWorkingModal from '../../components/ui/modals/Professional/ProWorkingModal'

const ProfContact = ({ userId = '', userData = '' }) => {


    const context = useContext(StatesContext)
    const { state: userStata } = context

    let state = userStata

    if (userData) {
        state = userData
    }


    const [hours, setHours] = useState();
    const [open, setopen] = useState(false)

    const { data } = useQuery({
        queryKey: ['time'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/working-hours/get-working-hours/${userId ? userId : state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    const findTime = (day) => {
        let time = "10:00 AM - 07:00 PM";
        if (hours && hours.length > 0) {
            const index = hours.findIndex((user) => user.day === day);
            if (index >= 0) {
                time = hours[index].time;
            }
        }
        return time;
    };


    useEffect(() => {

        if (data && data.length > 0) {
            setHours(data)
        }

    }, [data])



    return (
        <div className={`w-full ${!userId && 'bg-[#141414] rounded-[12px] px-[20px] py-[20px]'} `}>

            {open && (
                <ProfWorkingModal open={open} setOpen={setopen} data={data} />
            )}

            {!userId && (
                <div className='flex justify-between items-center'>

                    <div>
                        <h2 className='text-white font-n font-bold text-[12px] sm:text-[16px]'>
                            Business hours
                        </h2>

                    </div>

                    <div className="">

                        <PencilSquareIcon className='text-white h-[17px] sm:h-[20px] cursor-pointer '
                            onClick={() => setopen(true)}
                        />

                    </div>


                </div>
            )}

            <div className={`mt-[15px]  ${userId ? 'space-y-[24px]' : 'space-y-[10px]'}`}>

                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Monday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Monday') ? 'Off' : findTime("Monday")}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Tuesday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Tuesday') ? 'Off' : findTime("Tuesday")}

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Wednesday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Wednesday') ? 'Off' : findTime("Wednesday")}

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Thursday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Thursday') ? 'Off' : findTime("Thursday")}

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Friday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Friday') ? 'Off' : findTime("Friday")}

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Saturday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Saturday') ? 'Off' : findTime("Saturday")}

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" inline-block">
                        <div className={`text-white text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[14px]'} font-semibold`}>Sunday</div>
                    </div>
                    <div className={`text-gray-200 text-[12px] ${userId ? 'sm:text-[16px]' : 'sm:text-[13px]'} `}>
                        {state.user.offDays.includes('Sunday') ? 'Off' : findTime("Sunday")}

                    </div>
                </div>

            </div>

        </div>
    )
}

export default ProfContact