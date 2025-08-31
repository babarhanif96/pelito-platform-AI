import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import AddProductModal from '../../components/ui/modals/Professional/AddProductModal'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import ProSettingsModal from '../../components/ui/modals/Professional/ProfSettingsModal'

const ProfProduct = () => {

    const queryClient = useQueryClient()

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const [open, setopen] = useState(false)
    const [serviceData, setserviceData] = useState('')
    const [openSetting, setopenSetting] = useState(false)


    const { data, isLoading } = useQuery({
        queryKey: ['product'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/product/get-all-product/${state.user._id}`, {
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

        handleStateChange({ loader: 'Deleting' })

        try {
            await axios
                .delete(BACKEND_URL + "/product/" + deleteId, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    handleStateChange({ success: 'Product deleted successfully' })
                    queryClient.invalidateQueries('product')
                })

        } catch (error) {

            console.log("Error:", error);
        } finally {
            handleStateChange({ loader: '' })
        }
    };


    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]'>

            {open && (
                <AddProductModal open={open} setOpen={setopen} serviceData={serviceData} />
            )}

            {openSetting && (
                <ProSettingsModal open={openSetting} setOpen={setopenSetting} />
            )}

            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-white font-n font-bold text-[12px] sm:text-[16px]'>
                        Our Products
                    </h2>

                </div>

                <div className="">

                    <PlusIcon className='text-white h-[17px] sm:h-[20px] cursor-pointer '
                        onClick={() => {

                            if (!state.user.salon_name) {
                                handleStateChange({ error: 'Please update your profile to include necessary details' })
                                setopenSetting(true)
                                return
                            }

                            setopen(true)
                            setserviceData('')
                        }}
                    />

                </div>


            </div>


            <div className='mt-[20px]'>

                {!isLoading && (
                    <div>
                        {data && data.length > 0 ? (
                            <div className="space-y-[20px]">
                                {data.map((data, i) => {


                                    return (
                                        <div className='flex justify-between items-center' key={i}>

                                            <div className='flex gap-[10px]'>
                                                <img
                                                    alt="workImg"
                                                    src={data.item.img_url}
                                                    className={`h-[80px]  w-[80px]  object-cover rounded-[12px]`}
                                                />
                                                <div>
                                                    <h2 className='text-white text-[16px] font-r font-semibold'>
                                                        {data.item.name}
                                                    </h2>
                                                    <h2 className='text-white text-[13px] font-r font-semibold'>
                                                        <span className='text-[#009688]'> $ {data.item.price}</span>
                                                    </h2>

                                                </div>
                                            </div>

                                            <div className='flex gap-[7px] items-center'>
                                                <PencilSquareIcon className='text-white h-[20px] cursor-pointer'
                                                    onClick={() => {
                                                        setserviceData(data.item)
                                                        setopen(true)
                                                    }}
                                                />
                                                <TrashIcon className='text-white h-[20px] cursor-pointer' onClick={() => handleDelete(data.item._id)} />
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-white  font-r font-semibold text-[12px] pb-[10px]">
                                No products are added yet.
                            </div>
                        )}
                    </div>
                )}

            </div>

        </div>
    )
}

export default ProfProduct