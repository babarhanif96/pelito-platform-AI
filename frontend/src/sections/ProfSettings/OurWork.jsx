import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import React, { useContext, useRef } from 'react'
import StatesContext from '../../context/StatesContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'
import axios from 'axios'

const OurWork = () => {

    const queryClient = useQueryClient()

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const inputRef = useRef();

    const { data, isLoading } = useQuery({
        queryKey: ['work'],
        queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`${BACKEND_URL}/user/get-all-professional-images/${state.user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(async (res) => await res.json());
        },
    });


    const handleImg = async () => {
        const files = inputRef.current.files;

        if (files.length > 0) {

            handleStateChange({ loader: 'Uploading' })

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > 5242880) {
                    handleStateChange({ error: 'Image size should be less than 5MB' })
                    return
                } else {
                    formData.append("media", files[i]);
                }
            }

            const token = localStorage.getItem("token");

            if (formData) {

                handleStateChange({ loader: 'Uploading...' })

                await axios
                    .post(BACKEND_URL + "/upload/multi-upload", formData, {
                        headers: { authorization: "Bearer " + token },
                    })
                    .then(function (response) {
                        let arr = [];

                        response.data.forEach((item) => {
                            arr.push(item.media);
                        });

                        let formDataAdd = {};
                        formDataAdd["user_id"] = state.user._id;
                        formDataAdd["image_urls"] = arr;

                        axios
                            .post(BACKEND_URL + "/user/professional-images", formDataAdd, {
                                headers: { authorization: "Bearer " + token },
                            })
                            .then(function (response) {
                                queryClient.invalidateQueries('work')
                                handleStateChange({ success: 'Images added successfully' })

                            })

                    }).finally(() => {
                        handleStateChange({ loader: '' })
                    })

            }

        }
    };


    const handleDelete = async (deleteId) => {


        const token = localStorage.getItem("token");

        handleStateChange({ loader: 'Deleting' })

        try {
            await axios
                .delete(BACKEND_URL + "/user/professional-images/" + deleteId, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    handleStateChange({ success: 'Image deleted successfully' })
                    queryClient.invalidateQueries('work')
                })

        } catch (error) {

            console.log("Error:", error);
        } finally {
            handleStateChange({ loader: '' })
        }
    };


    const sortImage = async (index, image_urls) => {


        const token = localStorage.getItem("token");

        handleStateChange({ loader: 'Updating' })

        try {
            await axios
                .put(BACKEND_URL + "/user/sort-image/" + state.user._id, {
                    index,
                    image_urls
                }, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    queryClient.invalidateQueries('work')
                    setTimeout(() => {
                        handleStateChange({ loader: '' })
                    }, 1500);
                })

        } catch (error) {

            console.log("Error:", error);
            handleStateChange({ loader: '' })
        }
    };


    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]'>

            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-white font-n font-bold text-[12px] sm:text-[16px]'>
                        Our Work
                    </h2>

                </div>

                <div className="">
                    <label
                        htmlFor="fileInputmultiple"
                    >
                        <PlusIcon className='text-white h-[17px] sm:h-[20px] cursor-pointer ' />

                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="fileInputmultiple"
                        ref={inputRef}
                        onChange={() => handleImg()}
                        className="hidden"
                        multiple={true}
                    />
                </div>


            </div>


            <div className='mt-[20px]'>

                {!isLoading && (
                    <div>
                        {data && data.length > 0 ? (
                            <div className="flex flex-wrap justify-center md:justify-start gap-[10px] items-center">
                                {data.map((img, i) => {
                                    return (
                                        <div className='relative' key={i}>
                                            <img
                                                alt="workImg"
                                                src={img.image_urls ? img.image_urls : "img/img2.png"}
                                                className={`h-[100px] md:h-[150px] w-[100px] md:w-[150px] object-cover rounded-[12px]`}
                                            />

                                            <div className='absolute bottom-[10px] right-[10px] cursor-pointer'>
                                                <TrashIcon className='h-[20px] sm:h-[23px] text-red-500 cursor-pointer'
                                                    onClick={() => handleDelete(img._id)}
                                                />
                                            </div>

                                            {data.length > 1 && i > 0 && (
                                                <div className='absolute top-[10px] left-[10px]'>
                                                    <div className='h-[25px] w-[25px] cursor-pointer rounded-full bg-[#009688] flex justify-center items-center'
                                                        onClick={() => {
                                                            let priority = data[i - 1].priority;
                                                            sortImage(priority, img.image_urls)
                                                        }}
                                                    >
                                                        <ChevronLeftIcon className='text-white h-[14px]' />
                                                    </div>
                                                </div>
                                            )}


                                            {data.length > 1 && i < data.length - 1 && (

                                                <div className='absolute top-[10px] right-[10px]'>
                                                    <div className='h-[25px] w-[25px] cursor-pointer rounded-full bg-[#009688] flex justify-center items-center'
                                                        onClick={() => {
                                                            let priority = data[i + 1].priority;
                                                            sortImage(priority, img.image_urls)
                                                        }}
                                                    >
                                                        <ChevronRightIcon className='text-white h-[14px]' />
                                                    </div>
                                                </div>

                                            )}

                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-white  font-r font-semibold text-[12px] pb-[10px]">
                                No Images are added yet.
                            </div>
                        )}
                    </div>
                )}

            </div>

        </div>
    )
}

export default OurWork