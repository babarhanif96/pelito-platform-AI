/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CircularProgress } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { BACKEND_URL } from '../../../constant';
import StatesContext from '../../../context/StatesContext';
import InputFeild from '../InputFeild';


const CusSettingsModal = ({ open, setOpen, isCart, shippingName, setshippingName, setisConfirmed }) => {

    const queryClient = useQueryClient();

    const context = useContext(StatesContext);
    const { state: userData, handleStateChange } = context;

    const [first_name, setFirstName] = useState(userData?.user?.first_name || "");
    const [last_name, setlast_name] = useState(userData?.user?.last_name || "")
    const [phone_number, setPhoneNumber] = useState(userData?.user?.phone_number || "");
    const [address_line1, setAddressLine1] = useState(userData?.user?.address_line1 || "");
    const [address_line2, setAddressLine2] = useState(userData?.user?.address_line2 || "");
    const [pincode, setPincode] = useState(userData?.user?.pincode || "");
    const [city, setCity] = useState(userData?.user?.city || "");
    const [state, setState] = useState(userData?.user?.state || "");
    const [country, setCountry] = useState(userData?.user?.country || "");
    const [profile_picture, setprofile_picture] = useState(userData?.user?.profile_picture || "")
    const [loadingImg, setLoadingImg] = useState(false);

    const inputRef = useRef();

    const handleImg = async () => {
        const files = inputRef.current.files;

        const token = localStorage.getItem('token');

        if (files.length > 0) {
            setLoadingImg(true);

            const formData1 = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData1.append("media", files[i]);
            }

            await axios
                .post(BACKEND_URL + "/upload/single-upload", formData1, {
                    headers: { authorization: "Bearer " + token },
                })
                .then(function (response) {

                    setprofile_picture(response.data.media);
                    setLoadingImg(false);
                })
                .catch(function (error) {
                    setLoadingImg(false);
                    console.log(error);
                });
        }
    };

    const mutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/user/update-primary-salon/${userData.user?._id}`, {

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
                handleStateChange({ success: 'Details updated successfully' })
                setOpen(false)
                if (isCart) {
                    setisConfirmed(true)
                }

            } else {
                handleStateChange({ error: res.message })
            }

        },
        onError(error) {
            console.log(error)
        }


    })

    const handleClick = (e) => {

        e.preventDefault();

        if (loadingImg) return;

        // const formattedSalonName = salon_name.trim().toLowerCase().replace(/\s+/g, "-");

        mutation.mutate({
            first_name,
            last_name,
            phone_number,
            address_line1,
            address_line2,
            pincode,
            city,
            state,
            country,
            profile_picture,
        });
    };



    return (
        <div>
            {open && (
                <div
                    className="fixed top-0 left-0 w-full h-full z-50"
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                    }}
                ></div>
            )}

            {open && (
                <div
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[850px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[800px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[16px] sm:text-[22px]'>
                                    {isCart ? 'Shipping Details' : 'Profile'}
                                </h2>
                                <div className='h-[28px] w-[28px] cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
                                    onClick={() => {
                                        setOpen(false)
                                    }}
                                >
                                    <XMarkIcon className='h-[14px] text-white' />
                                </div>
                            </div>

                            <div className=' w-full  rounded-[20px] relative '>

                                <div className="bg-[#141414] relative z-10  rounded-[20px] px-[10px] lg:px-[20px] py-[30px] h-full">

                                    <form onSubmit={(e) => handleClick(e)} className='mt-[50px] px-[10px] space-y-[15px] max-h-[400px] lg:max-h-[450px] overflow-auto'>
                                        {isCart ? (
                                            <div className=''>
                                                <div>
                                                    <h2 className='text-white text-[14px] pb-[7px]'>
                                                        Shipping Name
                                                    </h2>
                                                    <InputFeild
                                                        isSetting={true}
                                                        placeholder={'Enter Shipping Name'}
                                                        onChange={setshippingName}
                                                        value={shippingName}
                                                        required={true}
                                                    />
                                                </div>

                                            </div>
                                        ) : (
                                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>
                                                <div>
                                                    <h2 className='text-white text-[14px] pb-[7px]'>
                                                        First Name
                                                    </h2>
                                                    <InputFeild
                                                        isSetting={true}
                                                        placeholder={'John'}
                                                        value={first_name}
                                                        onChange={setFirstName}
                                                        required={true}
                                                    />
                                                </div>
                                                <div>
                                                    <h2 className='text-white text-[14px] pb-[7px]'>
                                                        Last Name
                                                    </h2>
                                                    <InputFeild isSetting={true}
                                                        placeholder={'Carter'}
                                                        value={last_name}
                                                        onChange={setlast_name}
                                                        required={true}
                                                    />
                                                </div>
                                            </div>
                                        )}



                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    Phone Number
                                                </h2>
                                                <InputFeild
                                                    isSetting={true}
                                                    placeholder={'Enter mobile number'}
                                                    type={'number'}
                                                    value={phone_number}
                                                    onChange={setPhoneNumber}
                                                    required={true}
                                                />
                                            </div>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    Address Line 1
                                                </h2>
                                                <InputFeild
                                                    isSetting={true}
                                                    placeholder={'Professional Salon / 376 Broadway'}
                                                    value={address_line1}
                                                    onChange={setAddressLine1}
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    Address Line 2
                                                </h2>
                                                <InputFeild
                                                    isSetting={true}
                                                    placeholder={'Ste 21, American Pharoah, Saratoga Springs'}
                                                    value={address_line2}
                                                    onChange={setAddressLine2}
                                                />
                                            </div>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    City
                                                </h2>
                                                <InputFeild
                                                    isSetting={true}
                                                    placeholder={'Chicago'}
                                                    value={city}
                                                    onChange={setCity}
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    State
                                                </h2>
                                                <InputFeild isSetting={true}
                                                    placeholder={'New York'}
                                                    value={state}
                                                    onChange={setState}
                                                    required={true}
                                                />
                                            </div>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    Country
                                                </h2>
                                                <InputFeild isSetting={true}
                                                    placeholder={'United States'}
                                                    value={country}
                                                    onChange={setCountry}
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>
                                            <div>
                                                <h2 className='text-white text-[14px] pb-[7px]'>
                                                    Postal Code
                                                </h2>
                                                <InputFeild
                                                    isSetting={true}
                                                    placeholder={'12866'}
                                                    type={'number'}
                                                    value={pincode}
                                                    onChange={setPincode}
                                                />
                                            </div>

                                        </div>

                                        {!isCart && (
                                            <div className="">
                                                <label
                                                    htmlFor="fileInput"
                                                    className="text-[#009688] font-semibold opacity-80 cursor-pointer text-[14px]"
                                                >
                                                    + Upload Profile Picture
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
                                        )}
                                        {!isCart && (
                                            <div>
                                                {loadingImg ? (

                                                    <div className='flex justify-center'>
                                                        <CircularProgress sx={{ color: 'white' }} size={25} />
                                                    </div>

                                                ) : (
                                                    <>
                                                        {profile_picture && (
                                                            <img
                                                                src={profile_picture}
                                                                alt="user profile"
                                                                className="h-[80px] w-[80px] rounded-full object-cover mt-1"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}



                                        <div className='flex justify-end pt-[10px]'>
                                            <button
                                                type='submit'
                                                disabled={mutation.isPending}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>
                                                {mutation.isPending ? <CircularProgress sx={{ color: 'white' }} size={20} /> : `${isCart ? 'Confirm' : 'Update'}`}
                                            </button>
                                        </div>


                                    </form>

                                </div>

                                <div className='absolute inset-[-2px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[20px]' />


                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CusSettingsModal;
