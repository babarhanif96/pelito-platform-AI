import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/solid'
import React, { useContext, useRef, useState } from 'react'
import StatesContext from '../../context/StatesContext'
import { BACKEND_URL } from '../../constant'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircularProgress } from '@mui/material'
import { replaceLinks } from '../../utils'
import axios from 'axios'

const FeedPosts = () => {

    const inputRef = useRef();
    const inputRefV = useRef();

    const [text, setText] = useState("");
    const [imgUrls, setImgUrls] = useState([]);
    const [vidUrls, setVidUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const queryClient = useQueryClient()

    const context = useContext(StatesContext)
    const { handleStateChange, state } = context

    const mutation = useMutation({

        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/professional-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add this if required
                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {
            let res = await data.json()
            if (res.success) {

                handleStateChange({ success: 'Post created successfully' })
                queryClient.invalidateQueries('posts')
                setText('')
                setImgUrls([])
                setVidUrls([])

            } else {
                handleStateChange({ error: res.msg })
            }
        },
        onError(error) {
            console.log(error)
        }


    })

    const handleImg = async () => {

        const files = inputRef.current.files;
        const token = localStorage.getItem('token');

        if (files.length > 0) {
            setLoading(true);
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > 5242880) {
                    handleStateChange({ error: 'File size should be less than 5MB' })
                    setLoading(false);
                    return
                } else {
                    formData.append("media", files[i]);
                }
            }

            await axios
                .post(BACKEND_URL + "/upload/multi-upload", formData, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    let arr = imgUrls ? imgUrls : [];
                    setLoading(false);
                    response.data.forEach((item) => {
                        arr.push(item.media);
                    });
                    setImgUrls(arr);
                    setCount(count + 1);
                })
                .catch(function (error) {
                    setLoading(false);
                    console.log(error);
                });
        }
    };

    const handleVideo = async () => {

        const files = inputRefV.current.files;
        const token = localStorage.getItem('token');


        if (files.length > 0) {
            setLoading(true);
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > 50 * 1024 * 1024) {
                    handleStateChange({ error: 'File size should be less than 5MB' })
                    setLoading(false);
                } else {
                    formData.append("media", files[i]);
                }
            }

            await axios
                .post(BACKEND_URL + "/upload/multi-upload", formData, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {
                    let arr = vidUrls ? vidUrls : [];
                    setLoading(false);
                    response.data.forEach((item) => {
                        arr.push(item.media);
                    });
                    setVidUrls(arr);
                    setCount(count + 1);
                })
                .catch(function (error) {
                    setLoading(false);
                    console.log(error);
                });
        }
    };

    const handleCreatePost = () => {

        if (text || imgUrls.length > 0 || vidUrls.length > 0) {


            let formData = {};
            formData["user_id"] = state.user._id;

            if (text) {
                const replacedText = replaceLinks(text);
                formData["caption"] = replacedText;
            }

            if (imgUrls.length > 0) {
                formData["image_url"] = [...imgUrls]; // Directly spread
            }

            if (vidUrls.length > 0) {
                formData["video_url"] = [...vidUrls]; // Directly spread
            }


            mutation.mutate(formData);


        } else {
            handleStateChange({ error: 'Please add some content' })
        }


    }


    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[30px]'>
            <div className='flex gap-[10px]'>
                <img
                    className='rounded-full h-[30px] w-[30px]'
                    src={state.user.profile_picture} alt="" />
                <div className='flex flex-col gap-[10px] w-full'>
                    <textarea
                        className='outline-none w-full bg-[rgba(225,225,225,0.1)] h-[130px] sm:h-[90px] px-[15px] py-[10px] rounded-[7px] font-r text-white font-n text-[14px] font-normal'
                        placeholder='What’s on your mind?'
                        style={{
                            resize: 'none'
                        }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    
                    <div className='flex items-center gap-[10px]'>

                        {/* Image Upload */}
                        <div>
                            <PhotoIcon
                                className='h-[24px] text-gray-300 cursor-pointer'
                                onClick={() => inputRef.current.click()}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={inputRef}
                                onChange={handleImg}
                                className="hidden"
                            />
                        </div>

                        {/* Video Upload */}
                        <div>
                            <VideoCameraIcon
                                className='h-[24px] text-gray-300 cursor-pointer'
                                onClick={() => inputRefV.current.click()}
                            />
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                ref={inputRefV}
                                onChange={handleVideo}
                                className="hidden"
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className='flex justify-end pt-[10px] sm:pt-0'>
                <button
                    onClick={() => handleCreatePost()}
                    disabled={mutation.isPending}
                    className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>
                    {mutation.isPending ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Create Post'}
                </button>
            </div>

            {loading && (
                <div className='flex justify-center mt-[40px]'>
                    <CircularProgress sx={{ color: 'white' }} />
                </div>
            )}


            {imgUrls && imgUrls.length > 0 ? (
                <div className="mt-[20px]">
                    {imgUrls.map((media, index) => (
                        <div key={index} className="inline-block mr-2">
                            <img
                                src={media}
                                className="w-[115px] h-[115px] object-cover rounded-md"
                                alt="postImage"
                            />
                        </div>
                    ))}
                </div>
            ) : null}

            {vidUrls && vidUrls.length > 0 ? (
                <div className="mt-[30px]">
                    {vidUrls.map((media, index) => (
                        <div key={index} className="inline-block mr-2">
                            <video controls className="w-[200px] h-[150px] rounded-md">
                                <source src={media} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            ) : null}


        </div>
    )
}

export default FeedPosts