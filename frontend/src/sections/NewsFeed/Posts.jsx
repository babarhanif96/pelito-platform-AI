import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer"; // For auto-loading on scroll
import TimeAgo from 'react-timeago';
import { BACKEND_URL } from "../../constant";
import StatesContext from "../../context/StatesContext";

import { Checkbox, CircularProgress } from "@mui/material";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { ChatBubbleLeftIcon, FlagIcon, PencilIcon, PencilSquareIcon, PhotoIcon, TrashIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import CommentsModal from "../../components/ui/modals/CommentsModal";
import { useLocation } from "react-router";
import ReportModal from "../../components/ui/modals/ReportModal";
import axios from "axios";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Posts = () => {


    const queryClient = useQueryClient();

    const inputRef = useRef();
    const inputRefV = useRef();

    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [comment, setComment] = useState({});
    const [open, setopen] = useState(false)
    const [commentsData, setcommentsData] = useState([])
    const [editId, seteditId] = useState('')
    const [newText, setnewText] = useState('')
    const [reportId, setreportId] = useState('')
    const [reportOpen, setreportOpen] = useState(false)
    const [openCmnt, setopenCmnt] = useState('')

    const { ref, inView } = useInView(); // Observer to detect when user reaches the end

    const { pathname } = useLocation()

    const isMyPosts = pathname.includes('mypost') || pathname.includes('reported')

    const isReported = pathname.includes('reported')

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['posts', isMyPosts],
        queryFn: async ({ pageParam = 1 }) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/post/get-all-professional-post?limit=10&page=${pageParam}&user_id=${isMyPosts ? state.user._id : ''}&isReported=${isReported ? true : false}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.json();
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.posts?.length ? allPages.length + 1 : undefined; // If posts exist, fetch next page
        },
    });

    console.log(data)

    const addLikemutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/add-likes`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('posts')

        },
        onError(error) {
            console.log(error)
        }


    })

    const removeLikemutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/delete-likes/${newData.post_id}/${newData.like}`, {

                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('posts')

        },
        onError(error) {
            console.log(error)
        }


    })

    const addCommentmutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/add-comment`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('posts')

        },
        onError(error) {
            console.log(error)
        }


    })


    const delPostMutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/professional-post/${newData.id}`, {

                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('posts')
            handleStateChange({ loader: '' })
            handleStateChange({ success: 'Post deleted successfully' })

        },
        onError(error) {
            console.log(error)
        }


    })

    const adminDelPostMutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/admin/professional-post/${newData.id}`, {

                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },
        async onSuccess(data) {

            queryClient.invalidateQueries('posts')
            handleStateChange({ loader: '' })
            handleStateChange({ success: 'Post deleted successfully' })

        },
        onError(error) {
            console.log(error)
        }


    })

    const updatePostMutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/post/professional-post/${editId}`, {

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
                queryClient.invalidateQueries('posts')
                handleStateChange({ loader: '' })
                handleStateChange({ success: 'Post updated successfully' })
                seteditId('')

            } else {
                handleStateChange({ loader: '' })
                handleStateChange({ error: res.msg })
            }


        },
        onError(error) {
            console.log(error)
        }


    })

    const handleLike = async (id, like) => {

        if (addLikemutation.isPending || removeLikemutation.isPending) return

        const index = like.findIndex(
            (user) => user.user_id._id === state.user._id
        );

        handleStateChange({ loader: 'Loading' });

        if (index >= 0) {
            await removeLikemutation.mutateAsync({
                post_id: id,
                user_id: state.user._id,
                like: like[index]._id
            })
        } else {
            await addLikemutation.mutateAsync({
                post_id: id,
                user_id: state.user._id
            })
        }

        setTimeout(() => {
            handleStateChange({ loader: '' });
        }, 3000);

    }

    const handleComment = async (id) => {
        if (addCommentmutation.isPending || !comment[id]) return;

        handleStateChange({ loader: 'Posting' });

        await addCommentmutation.mutateAsync({
            post_id: id,
            user_id: state.user._id,
            comment_text: comment[id]
        });

        setComment({ ...comment, [id]: "" }); // Clear the comment field for this post
        handleStateChange({ loader: '' });
        setopenCmnt('')
    };

    const handleImg = async (e, postId) => {

        const files = inputRef.current.files;
        const token = localStorage.getItem('token');

        if (files.length > 0) {

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > 5242880) {
                    handleStateChange({ error: 'File size should be less than 5MB' })
                    return
                } else {
                    formData.append("media", files[i]);
                }
            }

            handleStateChange({ loader: 'Loading' })


            await axios
                .post(BACKEND_URL + "/upload/multi-upload", formData, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(async function (response) {
                    let arr = [];

                    response.data.forEach((item) => {
                        arr.push(item.media);
                    });

                    const res = await axios
                        .put(BACKEND_URL + "/post/image", {
                            postId: postId,
                            image_url: arr
                        }, {
                            headers: { authorization: "Bearer " + token },
                        })

                    if (res.data.success) {
                        queryClient.invalidateQueries('posts')

                    } else {
                        handleStateChange({ error: res.data.msg })
                    }

                    setTimeout(() => {
                        handleStateChange({ loader: '' })
                    }, 1500);

                })
                .catch(function (error) {
                    handleStateChange({ loader: '' })
                    console.log(error);
                });
        }
    };

    const handleVideo = async (e, postId) => {

        const files = inputRefV.current.files;
        const token = localStorage.getItem('token');


        if (files.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > 50 * 1024 * 1024) {
                    handleStateChange({ error: 'File size should be less than 50MB' })

                } else {
                    formData.append("media", files[i]);
                }
            }

            handleStateChange({ loader: 'Loading' })

            await axios
                .post(BACKEND_URL + "/upload/multi-upload", formData, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(async function (response) {
                    let arr = [];

                    response.data.forEach((item) => {
                        arr.push(item.media);
                    });

                    const res = await axios
                        .put(BACKEND_URL + "/post/video", {
                            postId: postId,
                            video_url: arr
                        }, {
                            headers: { authorization: "Bearer " + token },
                        })

                    if (res.data.success) {
                        queryClient.invalidateQueries('posts')

                    } else {
                        handleStateChange({ error: res.data.msg })
                    }

                    setTimeout(() => {
                        handleStateChange({ loader: '' })
                    }, 1500);

                })
                .catch(function (error) {
                    handleStateChange({ loader: '' })
                    console.log(error);
                });
        }
    };

    const handleDeleteImage = async (img) => {

        const token = localStorage.getItem('token');

        handleStateChange({ loader: 'Deleting' })

        const res = await axios
            .put(BACKEND_URL + "/post/image", {
                postId: editId,
                image_url: img,
                delete: true
            }, {
                headers: { authorization: "Bearer " + token },
            })

        if (res.data.success) {
            queryClient.invalidateQueries('posts')

        } else {
            handleStateChange({ error: res.data.msg })
        }

        setTimeout(() => {
            handleStateChange({ loader: '' })
        }, 1500);
    }

    const handleVideoDelete = async (vid) => {

        const token = localStorage.getItem('token');

        handleStateChange({ loader: 'Deleting' })

        const res = await axios
            .put(BACKEND_URL + "/post/video", {
                postId: editId,
                video_url: vid,
                delete: true
            }, {
                headers: { authorization: "Bearer " + token },
            })

        if (res.data.success) {
            queryClient.invalidateQueries('posts')

        } else {
            handleStateChange({ error: res.data.msg })
        }

        setTimeout(() => {
            handleStateChange({ loader: '' })
        }, 1500);

    }

    // Auto-fetch next page when the last element is in view
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage]);

    return (
        <div>
            {isLoading && (
                <div className="flex justify-center mt-[40px]">
                    <CircularProgress sx={{ color: 'white' }} />
                </div>
            )}

            {open && (
                <CommentsModal open={open} setOpen={setopen} commentsData={commentsData} />
            )}

            {reportOpen && (
                <ReportModal open={reportOpen} setOpen={setreportOpen} reportId={reportId} />
            )}

            <div className="space-y-[10px] mt-[10px]">
                {data?.pages.map((page) =>
                    page.posts?.length > 0 && page.posts.map((post, i) => (
                        <div key={post._id} className={`w-full bg-[#141414] rounded-[12px] px-[20px] pt-[15px]  ${openCmnt ? 'pb-[20px]' : 'pb-[10px]'}`}>
                            {/* Post Content */}
                            <div className="flex justify-between items-center">

                                <div className="flex items-center gap-[10px]">
                                    <img src={post.user_id.profile_picture} alt="" className="rounded-full h-[35px] w-[35px]" />
                                    <div>
                                        <h2 className="text-white font-bold text-[15px] leading-[10px] pt-[5px]">
                                            {post.user_id.first_name} {post.user_id.last_name}
                                        </h2>

                                        <TimeAgo
                                            date={new Date(post.created)}
                                            className="text-white text-[11px]" />
                                    </div>
                                </div>
                                {state.user.user_type === 'admin' ? (
                                    <TrashIcon className="text-white h-[20px] cursor-pointer"
                                        onClick={() => {
                                            handleStateChange({ loader: 'Deleting' })
                                            adminDelPostMutation.mutate({ id: post._id })
                                        }}
                                    />
                                ) : (
                                    <div>
                                        {post.user_id._id === state.user._id ? (
                                            <div className="flex gap-[7px] items-center">
                                                <PencilSquareIcon className="text-white h-[20px] cursor-pointer"
                                                    onClick={() => {
                                                        seteditId(post._id)
                                                        setnewText(post.caption)
                                                    }}
                                                />
                                                <TrashIcon className="text-white h-[20px] cursor-pointer"
                                                    onClick={() => {
                                                        handleStateChange({ loader: 'Deleting' })
                                                        delPostMutation.mutate({ id: post._id })
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <FlagIcon className="text-white h-[20px] cursor-pointer"
                                                onClick={() => {
                                                    setreportId(post._id)
                                                    setreportOpen(true)
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                            </div>


                            {editId === post._id ? (
                                <textarea
                                    className='outline-none w-full mt-[15px] bg-[rgba(225,225,225,0.1)] h-[130px] sm:h-[90px] px-[15px] py-[10px] rounded-[7px] font-r text-white font-n text-[14px] font-normal'
                                    placeholder='What’s on your mind?'
                                    style={{
                                        resize: 'none'
                                    }}
                                    value={newText}
                                    onChange={(e) => setnewText(e.target.value)}
                                />
                            ) : (

                                <p className="text-white font-normal text-[16px] pt-[15px]">{post.caption}</p>
                            )}

                            {editId === post._id && (
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
                                            onChange={(e) => handleImg(e, post._id)}
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
                                            onChange={(e) => handleVideo(e, post._id)}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )}

                            {editId === post._id && (
                                <div className="flex justify-end mt-[10px] items-center gap-[10px]">
                                    <button
                                        onClick={() => seteditId('')}
                                        className="bg-gray-600 text-white w-[70px] sm:w-[90px] h-[33px] text-[15px] rounded-[7px]">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (newText === post.caption || !newText) return
                                            handleStateChange({ loader: 'Updating' })
                                            updatePostMutation.mutate({ caption: newText })
                                        }}
                                        className="bg-[#009688] text-white w-[70px] sm:w-[90px] h-[33px] text-[15px] rounded-[7px]">
                                        Update
                                    </button>
                                </div>
                            )}

                            {post.image_url?.length > 0 && (
                                <div className="mt-[20px]">
                                    {post.image_url.map((img, index) => (
                                        <div className="relative h-[115px] w-[115px]">
                                            <img key={index} alt="post" className="inline-block mr-[15px] object-cover h-[115px] w-[115px]" src={img} />

                                            {editId === post._id && (
                                                <div className='absolute bottom-[10px] right-[10px] cursor-pointer'>
                                                    <TrashIcon className='h-[20px] sm:h-[23px] text-red-500 cursor-pointer'
                                                        onClick={() => handleDeleteImage(img)}
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            )}

                            {post.video_url?.length > 0 && (
                                <div className="mt-[20px]">
                                    {post.video_url.map((vid, index) => (
                                        <div key={index} className="inline-block mr-[15px] relative">
                                            <video controls width="200" height="150">
                                                <source src={vid} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>

                                            {editId === post._id && (
                                                <div className='absolute top-[10px] right-[10px] cursor-pointer'>
                                                    <TrashIcon className='h-[20px] sm:h-[23px] text-red-500 cursor-pointer'
                                                        onClick={() => handleVideoDelete(vid)}
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            )}


                            {/* Likes & Comments Section */}
                            <div className="flex items-center gap-[10px] mt-[5px]">
                                <div className="flex items-center ml-[-10px]">
                                    <Checkbox {...label}
                                        disableRipple
                                        onClick={(id) => handleLike(post._id, post.likes)}
                                        icon={<FavoriteBorder sx={{ color: 'white', fontSize: '22px' }} />}
                                        checkedIcon={<Favorite sx={{ color: 'red', fontSize: '22px' }} />}
                                        checked={post.likes.some((user) => user.user_id._id === state.user._id)}
                                    />

                                    <h2 className="text-white text-[12px] ml-[-5px]">
                                        {post.likes_count}{" "}
                                        {post.likes_count > 1 ? "Likes" : "Like"}
                                    </h2>

                                </div>
                                <div className="flex items-center gap-[5px]">

                                    <ChatBubbleLeftIcon className="text-white h-[20px] cursor-pointer"
                                        onClick={() => {
                                            setopenCmnt(post._id)
                                        }}
                                    />

                                    <h2 className="text-white text-[12px] cursor-pointer"
                                        onClick={() => {
                                            if (post.comments.length > 0) {
                                                setcommentsData(post);
                                                setopen(true)
                                            }
                                        }}
                                    >
                                        {post.comments_count}{" "}
                                        {post.comments_count > 1 ? "Comments" : "Comment"}
                                    </h2>

                                </div>
                            </div>

                            {openCmnt === post._id && (
                                <div className="flex items-center gap-[10px] mt-[15px]">
                                    <img src={state.user.profile_picture} alt="" className="h-[30px] w-[30px] rounded-full" />
                                    <input
                                        className='outline-none w-full bg-[rgba(225,225,225,0.1)] px-[12px] py-[9px] rounded-[7px] font-r text-white font-n text-[12px] font-normal'
                                        placeholder='Add a comment'
                                        value={comment[post._id] || ""}
                                        onChange={(e) => setComment({ ...comment, [post._id]: e.target.value })}
                                    />
                                    <button
                                        onClick={() => handleComment(post._id)}
                                        className="bg-[#009688] text-white w-[110px] h-[33px] text-[14px] rounded-[7px]">
                                        Comment
                                    </button>
                                </div>
                            )}

                        </div>
                    ))
                )}
            </div>

            {/* Load More */}
            {
                isFetchingNextPage && (
                    <div className="flex justify-center mt-[20px]">
                        <CircularProgress sx={{ color: 'white' }} />
                    </div>
                )
            }

            <div ref={ref} className="h-10"></div> {/* Intersection Observer Target */}
        </div >
    );
};

export default Posts;


