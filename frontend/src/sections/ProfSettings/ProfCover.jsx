import { PencilSquareIcon } from '@heroicons/react/24/solid'
import React, { useContext, useRef } from 'react'
import StatesContext from '../../context/StatesContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'
import axios from 'axios'

const ProfCover = () => {

    const queryClient = useQueryClient()

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const inputRef = useRef();

    const mutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/user/update-primary-salon/${state.user?._id}`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            let res = await data.json()

            if (res.success) {

                queryClient.invalidateQueries('user')


            } else {
                handleStateChange({ error: res.message })
            }

            setTimeout(() => {
                handleStateChange({ loader: '' })
            }, 4000);

        },
        onError(error) {
            console.log(error)
        }


    })

    const handleImg = async () => {
        const files = inputRef.current.files;

        const token = localStorage.getItem('token');

        if (files.length > 0) {

            handleStateChange({ loader: 'Uploading' })

            const formData1 = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData1.append("media", files[i]);
            }

            await axios
                .post(BACKEND_URL + "/upload/single-upload", formData1, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {

                    mutation.mutate({ cover_pic: response.data.media })

                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };


    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]'>

            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-white font-n font-bold text-[12px] sm:text-[16px]'>
                        Cover Photo
                    </h2>

                </div>

                <div className="">
                    <label
                        htmlFor="fileInput"
                    >
                        <PencilSquareIcon className='text-white h-[17px] sm:h-[20px] cursor-pointer ' />

                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="fileInput"
                        ref={inputRef}
                        onChange={() => handleImg()}
                        className="hidden"
                    />
                </div>


            </div>


            <img src={state.user.cover_pic} alt="" className='w-full object-cover rounded-[12px] mt-[20px] h-[200px] sm:h-[350px]' />


        </div>
    )
}

export default ProfCover