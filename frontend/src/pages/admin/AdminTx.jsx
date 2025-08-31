import React, { useContext, useState } from 'react'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import DashboardHeader from '../../components/DashboardHeader'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { FORMATDATE, FORMAT_ADDRESS, getDateFormate } from '../../utils'
import { CircularProgress, Pagination } from '@mui/material'
import { useNavigate } from 'react-router'
import axios from 'axios'


const AdminTx = () => {


    const tableHead = ['Payment Id', 'Paid Amount', 'Service Type', 'Payment Type', 'Date']

    const context = useContext(StatesContext)
    const { handleStateChange } = context


    const [page, setpage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['Tx', page],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/user/admin/tx?page=${page}`, {
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
                    <DashboardHeader title={`Transactions ${data?.totalUsers && `(${data.totalUsers})`}`} />

                    <div className=' mt-[30px]'>

                        <div className='relative mt-[20px]'>
                            <div className='relative z-10 bg-[#141414] flex flex-col items-center w-full p-[15px] rounded-[10px]'

                            >
                                <div className="relative rounded-[10px] overflow-x-auto w-full max-h-[400px]"

                                >
                                    <table className="w-full min-w-[1000px] lg:min-w-[900px]">
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



                                                    <td className="text-white text-center py-[7px] text-[12px] cursor-pointer underline underline-offset-4 font-medium"
                                                        onClick={() => {
                                                            handleStateChange({ success: 'Copied to clipboard' })
                                                            navigator.clipboard.writeText(item.payment_id)

                                                        }}
                                                    >
                                                        {FORMAT_ADDRESS(item.payment_id, 10)}
                                                    </td>
                                                    <td className="text-white text-center text-[12px]  font-medium">
                                                        ${item.price}
                                                    </td>
                                                    <td className="text-white text-center capitalize text-[12px]  font-medium">
                                                        {item.type}
                                                    </td>
                                                    <td className="text-white text-center capitalize text-[12px] font-medium">
                                                        {item.payment_id.startsWith("0x") ? "crypto" : "stripe"}
                                                    </td>

                                                    <td className="text-white text-center text-[12px]  font-medium">
                                                        {FORMATDATE(new Date(item.created))}
                                                    </td>



                                                </tr>
                                            ))}

                                            <tr
                                                style={{
                                                    background: '#141414',
                                                }}
                                            >
                                                {isLoading && (
                                                    <td colSpan={'5'} className="py-[85px] text-center">
                                                        <CircularProgress sx={{ color: 'white' }} />
                                                    </td>
                                                )}

                                                {!isLoading && data.users.length === 0 && (
                                                    <td colSpan={'5'} className="py-[85px] text-[16px] text-center text-white">
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

                </div>


            </div>

        </div>
    )
}

export default AdminTx