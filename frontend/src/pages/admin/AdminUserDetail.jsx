import React, { useContext, useState } from 'react'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import DashboardHeader from '../../components/DashboardHeader'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { FORMATDATE, getDateFormate } from '../../utils'
import { CircularProgress, Pagination } from '@mui/material'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'


const AdminUserDetail = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const { id } = useParams()

    const tableHead = ['Activity Id', 'Action', 'Date']

    const context = useContext(StatesContext)
    const { handleStateChange } = context


    const [page, setpage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['Activity', page],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/user/admin/activty?page=${page}&id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['User-Detail', id],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/user/admin/user/detail?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    return (
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title={`Activity`} />


                    {userLoading ? (

                        <div className='flex justify-center items-center h-[50vh]'>
                            <CircularProgress sx={{ color: 'white' }} />
                        </div>

                    ) : (
                        <div className=' mt-[30px]'>

                            <h2 className='text-white text-[25px] sm:text-[30px] font-semibold'>
                                {userData.user.first_name} {userData.user.last_name}
                            </h2>

                            {userData.user.user_type === 'professional' && (
                                <div className='flex justify-between items-center'>

                                    <h2 className='text-white text-[12px] sm:text-[16px] font-medium'>
                                        Total Revenue: ${userData.totalRevenue}
                                    </h2>

                                    {userData.user.salon_name && (
                                        <button
                                            onClick={() => {
                                                const formattedSalonName = userData.user.salon_name.trim().toLowerCase().replace(/\s+/g, "-")
                                                navigate(`/${formattedSalonName}`)
                                            }}
                                            className='bg-[#009688] text-white text-[12px] font-semibold w-[120px] h-[27px] rounded-[20px]'>
                                            Virtual Profile
                                        </button>
                                    )}

                                </div>
                            )}

                            <div className='relative mt-[20px]'>
                                <div className='relative z-10 bg-[#141414] flex flex-col items-center w-full p-[15px] rounded-[10px]'

                                >
                                    <div className="relative rounded-[10px] overflow-x-auto w-full max-h-[400px]"

                                    >
                                        <table className="w-full min-w-[500px] ">
                                            <thead className="text-[12px] font-medium text-[#87909C]" style={{ background: '#141414' }}>
                                                <tr className='border-b-[0.5px] border-gray-700'>
                                                    {tableHead.map((item, i) => (
                                                        <th scope="col" className={`py-[16px] px-[30px] text-center`} key={i}>
                                                            {item}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className='w-full'>
                                                {!isLoading && data.users.length > 0 && data.users.map((item, i) => (
                                                    <tr
                                                        style={{
                                                            background: '#141414'
                                                        }}
                                                        key={i}
                                                    >



                                                        <td className="text-white text-center py-[7px] text-[12px]  font-medium">
                                                            {item._id}
                                                        </td>
                                                        <td className="text-white text-center text-[12px]  font-medium">
                                                            {item.action}
                                                        </td>


                                                        <td className="text-white text-center text-[12px]  font-medium">
                                                            {FORMATDATE(new Date(item.date))}
                                                        </td>



                                                    </tr>
                                                ))}

                                                <tr
                                                    style={{
                                                        background: '#141414',
                                                    }}
                                                >
                                                    {isLoading && (
                                                        <td colSpan={'3'} className="py-[85px] text-center">
                                                            <CircularProgress sx={{ color: 'white' }} />
                                                        </td>
                                                    )}

                                                    {!isLoading && data.users.length === 0 && (
                                                        <td colSpan={'3'} className="py-[85px] text-[16px] text-center text-white">
                                                            No data found
                                                        </td>
                                                    )}


                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='flex justify-center mt-[30px] mb-[20px]'>
                                        {data && data.totalPages > 1 && (
                                            <Pagination
                                                color='primary'
                                                size='medium'
                                                count={data.totalPages}
                                                page={page}
                                                onChange={(event, value) => setpage(value)}

                                                sx={{
                                                    '& .MuiPaginationItem-root': {
                                                        color: 'white',
                                                        border: '1px solid #008b8b',
                                                        borderRadius: '50px',
                                                    },
                                                    '& .MuiButtonBase-root': {

                                                        '&:hover': {
                                                            backgroundColor: '#008b8b !important',

                                                        }
                                                    },
                                                    '& .Mui-selected': {

                                                        backgroundColor: '#008b8b !important',

                                                    },
                                                }}
                                            />
                                        )}
                                    </div>

                                </div>
                                <div className='absolute inset-[-1px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[10px]' />

                            </div>


                        </div>
                    )}



                </div>


            </div>

        </div>
    )
}

export default AdminUserDetail