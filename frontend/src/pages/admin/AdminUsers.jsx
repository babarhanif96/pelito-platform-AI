import React, { useContext, useState } from 'react'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import DashboardHeader from '../../components/DashboardHeader'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { FORMATDATE, getDateFormate } from '../../utils'
import { CircularProgress, Pagination } from '@mui/material'
import { useNavigate } from 'react-router'
import axios from 'axios'


const AdminUsers = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const tableHead = ['Name', 'Email', 'View Profile', 'Role', 'Registered At', 'Logged At', 'Action']

    const context = useContext(StatesContext)
    const { handleStateChange } = context


    const [page, setpage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['Users', page],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/user/admin/users?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    const handleDelete = async (deleteId) => {

        const token = localStorage.getItem("token");

        handleStateChange({ loader: 'Suspending' })

        try {
            const response = await axios.put(
                BACKEND_URL + "/user/admin/suspend/" + deleteId,
                {}, // Empty object since there's no request body
                { headers: { authorization: "Bearer " + token } }
            );
            if (response) {

                handleStateChange({ success: 'Account status updated!' })
                queryClient.invalidateQueries('users')

            }
        } catch (error) {

        } finally {
            handleStateChange({ loader: '' })
        }
    };

    const handleDeleteAcc = async (deleteId) => {

        const token = localStorage.getItem("token");

        handleStateChange({ loader: 'Deleting' })

        try {
            const response = await axios.put(
                BACKEND_URL + "/user/admin/delAcc/" + deleteId,
                {}, // Empty object since there's no request body
                { headers: { authorization: "Bearer " + token } }
            );
            if (response) {

                if (response.data.success) {
                    handleStateChange({ success: 'Account deleted successfully!' })
                    queryClient.invalidateQueries('users')
                } else {
                    handleStateChange({
                        error: response.data.message
                    })
                }


            }
        } catch (error) {

        } finally {
            handleStateChange({ loader: '' })
        }
    };


    return (
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title={`Users ${data?.totalUsers && `(${data.totalUsers})`}`} />

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



                                                    <td className="text-white text-center py-[7px] text-[12px]  font-medium">
                                                        {item.first_name +
                                                            " " +
                                                            item.last_name
                                                        }
                                                    </td>
                                                    <td className="text-white text-center text-[12px]  font-medium">
                                                        {item.email}
                                                    </td>
                                                    <td className="text-white text-center text-[12px]  font-medium">

                                                        <span className='cursor-pointer underline underline-offset-2'
                                                            onClick={() => {
                                                              
                                                                navigate(`/admin/users/${item._id}`)
                                                            }}

                                                        >
                                                            View
                                                        </span>

                                                    </td>
                                                    <td className="text-white text-center capitalize text-[12px]  font-medium">
                                                        {item.user_type}
                                                    </td>
                                                    <td className="text-white text-center text-[12px]  font-medium">
                                                        {getDateFormate(item.created)}
                                                    </td>
                                                    <td className="text-white text-center text-[12px]  font-medium">
                                                        {item.loggedAt && FORMATDATE(new Date(item.loggedAt))}
                                                    </td>

                                                    <td>
                                                        {item.user_type !== 'admin' && (

                                                            <div className='flex justify-center gap-[10px]'>
                                                                <button
                                                                    type='submit'

                                                                    onClick={() => handleDelete(item._id)}
                                                                    className={` ${!item.isSuspended ? 'bg-[#009688]' : 'bg-red-500'} text-white font-r font-medium text-[10px] w-[65px]  h-[22px] rounded-[20px]`}>
                                                                    {item.isSuspended ? 'Unsuspend' : 'Suspend'}
                                                                </button>
                                                                <button
                                                                    type='submit'
                                                                    onClick={() => handleDeleteAcc(item._id)}
                                                                    className='bg-red-500 text-white font-r font-medium text-[10px] w-[65px]  h-[22px] rounded-[20px]'>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}

                                                    </td>

                                                </tr>
                                            ))}

                                            <tr
                                                style={{
                                                    background: '#141414',
                                                }}
                                            >
                                                {isLoading && (
                                                    <td colSpan={'7'} className="py-[85px] text-center">
                                                        <CircularProgress sx={{ color: 'white' }} />
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

export default AdminUsers