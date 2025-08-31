import { useState } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Nav from '../components/Nav'
import SideBar from '../components/Sidebar'
import CreateGiftCardModal from '../components/ui/modals/CreateGiftCard'
import { BACKEND_URL } from '../constant'
import { useQuery } from '@tanstack/react-query'
import { CircularProgress } from '@mui/material'

const GiftCard = () => {


    const [open, setopen] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['giftCards'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/gift/cards`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });

    console.log(data);

    return (
        <div className=''>

            {open && (
                <CreateGiftCardModal open={open} setOpen={setopen} />
            )}

            <Nav />
            <SideBar />

            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Gift Cards' />

                    <div className=' mt-[40px] sm:mt-[60px] '>

                        <div className='flex justify-end '>
                            <button
                                onClick={() => setopen(true)}
                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[140px] h-[32px] sm:h-[35px] rounded-[7px]'>
                                Create Gift Card
                            </button>
                        </div>

                        {isLoading ? (
                            <div className='flex justify-center items-center h-[200px]'>
                                <CircularProgress sx={{ color: 'white' }} />
                            </div>
                        ) : (
                            <>
                                {data && data.data && data.data.length > 0 ? (
                                    <>
                                        <div className='relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] mt-[20px]'>
                                            {data.data.map((item, index) => (
                                                <div className=' w-full rounded-[20px] relative ' key={index}>
                                                    <div className="bg-[#141414] relative z-10 rounded-[20px] px-[10px] lg:px-[20px] py-[25px] h-full">

                                                        <h2 className='text-white font-r font-bold text-[18px] '>
                                                            {item.code}
                                                        </h2>


                                                        <h2 className='text-white font-bold text-[14px] mt-[2px]'>
                                                            {item.status}
                                                        </h2>

                                                        <div className='flex justify-end'>
                                                            <h2 className='text-white font-semibold text-[16px] mt-[5px]'>
                                                                {item.totalAmount} Pelito
                                                            </h2>
                                                        </div>

                                                    </div>

                                                    <div className='absolute inset-[-2px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[20px]' />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className='flex justify-center items-center h-[200px]'>
                                        <h2 className='text-white font-r font-medium text-[16px]'>
                                            No Gift Cards Found
                                        </h2>
                                    </div>
                                )}

                            </>
                        )}

                    </div>

                </div>
            </div>

        </div >
    )
}

export default GiftCard
