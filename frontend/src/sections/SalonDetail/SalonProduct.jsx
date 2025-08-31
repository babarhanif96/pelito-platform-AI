import React, { useContext, useState } from 'react'
import star from '../../assets/Star.png'
import moustache from '../../assets/moustache.png'
import StatesContext from '../../context/StatesContext'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../constant'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Pagination } from '@mui/material'

const SalonProduct = ({ data }) => {
    const queryClient = useQueryClient();
    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const itemsPerPage = 3;
    
    const addToCart = async (product) => {
        if (!state.user) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            handleStateChange({ loader: 'Loading' });

            let formData = {
                customer_user_id: state.user._id,
                seller_user_id: product.user_id,
                product_id: product._id,
                price: product.price,
                quantity: 1
            };

            const response = await axios.post(
                BACKEND_URL + "/product/add-to-cart",
                formData,
                {
                    headers: {
                        authorization: "Bearer " + token,
                    },
                }
            );

            if (response) {
                handleStateChange({ success: 'Product added to cart successfully' });
                queryClient.invalidateQueries('cart-product');
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            handleStateChange({ loader: '' });
        }
    };

    // Paginate the data
    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div className='relative'>

            <div className='absolute top-0 right-[30px]'>
                <img src={star} className='h-[30px] sm:h-[45px]' alt="" />
            </div>

          
            <h2 className='font-m sm:pt-[10px] text-white text-[40px] sm:text-[60px] font-normal text-center leading-[56px]'>
                Our Products
            </h2>
         
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px] mt-[30px] sm:mt-[60px]'>

                {paginatedData.length > 0 && paginatedData.map((item, index) => (
                    <div key={index} className='rounded-[15px] overflow-hidden bg-[#303030] cursor-pointer'
                        style={{
                            boxShadow: '0px 4px 60px 0px #7D87AB26'
                        }}
                    >
                        <img src={item.img_url} alt="" className='h-[200px] sm:h-[230px] lg:h-[290px] w-full object-cover' />
                        <div className='px-[13px] space-y-[5px] sm:space-y-0 pt-[13px] pb-[20px]'>
                            <h2 className='text-white font-m font-normal text-center text-[22px]'>
                                {item.name}
                            </h2>
                            <h2 className='text-[#66FCF1] font-r font-normal text-center text-[20px]'>
                                ${item.price}
                            </h2>

                            <div className='pt-[10px] flex justify-center '>
                                <button
                                    type='submit'
                                    className='text-white cursor-pointer w-[130px] sm:w-[143px] h-[35px] sm:h-[40px] font-r text-[14px] sm:text-[16px] font-bold rounded-[20px]'
                                    style={{
                                        borderWidth: '2.31px 0px 2.31px 0px',
                                        borderStyle: 'solid',
                                        borderColor: '#66FCF1'
                                    }}
                                    onClick={() => addToCart(item)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <div className='flex justify-center mt-[30px] mb-[20px]'>
                {totalPages > 1 && (
                    <Pagination
                        color='primary'
                        size='medium'
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
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
    )
}

export default SalonProduct
