import React, { useContext, useEffect, useState } from 'react'
import Nav from '../../../components/Nav'
import SideBar from '../../../components/Sidebar'

import CustomCalendar from '../../../components/Calendar/Calendar'
import DashboardHeader from '../../../components/DashboardHeader'
import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '../../../constant'
import StatesContext from '../../../context/StatesContext'
import WalkIn from '../../../sections/Appointment/WalkIn'
import { useNavigate } from 'react-router-dom'


const ProfAppointment = () => {

    const context = useContext(StatesContext)
    const { state } = context

    const navigate = useNavigate()

    const [bookedDates, setbookedDates] = useState([])
    const [open, setopen] = useState(false)

    const { data } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/service/get-my-salons/${state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });

    useEffect(() => {

        if (data && data.length > 0) {
            let dates = []
            data.map(item => {
                dates.push(new Date(item.day))
            })
            setbookedDates(dates)
        }

    }, [data])



    return (
        <div className=''>

            <WalkIn open={open} setopen={setopen} />

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Appointments' />

                    <div className=' mt-[30px]'>
                        <div className='flex justify-center md:justify-end items-center gap-[15px] '>
                            <button
                                onClick={() => navigate('/professional/appointments/list')}
                                className='w-[130px] sm:w-[158px] h-[40px] sm:h-[50px] rounded-[8px] text-white bg-[#F57C00] font-n font-medium text-[12px] sm:text-[15px]'>
                                Appointment List
                            </button>
                            <button
                                onClick={() => setopen(true)}
                                className='w-[130px] sm:w-[158px] h-[40px] sm:h-[50px] rounded-[8px] text-white bg-[#009688] font-n font-medium text-[12px] sm:text-[15px]'>
                                Add Appointment
                            </button>
                        </div>

                        <div className='mt-[40px] w-full'>
                            <CustomCalendar bookedDates={bookedDates} />
                        </div>

                        <div className='flex justify-end gap-[10px] items-center mt-[20px]'>
                            <div className='bg-[#009688] h-[10px] w-[10px] rounded-full' />
                            <h2 className='text-white font-n font-bold text-[11px] sm:text-[13px]'>
                                Upcoming Appointments
                            </h2>
                        </div>

                    </div>

                </div>


            </div>

        </div>
    )
}

export default ProfAppointment