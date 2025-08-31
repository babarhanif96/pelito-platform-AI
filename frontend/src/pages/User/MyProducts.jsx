import { CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { getDateFormate } from '../../utils'




const MyProducts = () => {


    const context = useContext(StatesContext)
    const { state, handleStateChange } = context


    const { data, isLoading } = useQuery({
        queryKey: ['my-products'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/product/purchase-products/${state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    console.log(data)



    return (
        <div className=''>



            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='My Products' />

                    {isLoading ? (
                        <div className='flex justify-center items-center h-[300px] sm:h-[400px]'>
                            <CircularProgress sx={{ color: 'white' }} />
                        </div>
                    ) : (
                        <div>
                            {data && data.length > 0 && (
                                <div className='mt-[30px] grid grid-cols-1 sm:grid-cols-3 gap-[20px]'>
                                    {data.map((products, i) => {

                                        let product = products.item;

                                        return <div key={i}

                                            className=' relative'
                                        >

                                            <div className='bg-[#393A3E] relative z-10 rounded-[15px] p-[15px]'>


                                                <h2 className='text-gray-300 font-semibold font-n text-[12px]'>
                                                    {getDateFormate(product.created)}                                                </h2>


                                                <div className='flex gap-[10px]'>
                                                    <img src={product.product_id.img_url} alt=""
                                                        className='object-cover rounded-[12px] mt-[15px] w-[120px] sm:w-[90px] h-[80px] sm:h-[90px]'
                                                    />

                                                    <div className='space-y-[3px]'>
                                                        <h2 className='text-white font-n text-[22px] font-semibold pt-[10px]'>
                                                            {product.product_id.name}
                                                        </h2>
                                                        <h2 className='text-white font-n font-semibold text-[13px]'>
                                                            Price : <span className='text-[#009688]'>${product.product_id.price}</span> </h2>

                                                        <h2 className='text-white font-n font-semibold text-[13px]'>
                                                            Qty : <span className='text-[#009688]'>{product.quantity}</span> </h2>

                                                    </div>

                                                </div>




                                            </div>

                                            <div className={`absolute inset-[-1.3px] bg-gradient-to-b from-[#009688] to-[#393A3E] rounded-[15px]`} />


                                        </div>
                                    })}
                                </div>
                            )}

                            {data && data.length === 0 && (
                                <div className='flex justify-center items-center h-[300px] sm:h-[400px]'>
                                    <h2 className='text-white font-n font-semibold text-[16px]'>
                                        No Products Found
                                    </h2>
                                </div>
                            )}
                        </div>
                    )}

                </div>


            </div>

        </div >
    )
}

export default MyProducts