import React, { useContext, useEffect, useRef, useState } from 'react'
import InputFeild from '../../components/ui/InputFeild'
import { useNavigate } from 'react-router-dom'
import StatesContext from '../../context/StatesContext'
import { BACKEND_URL } from '../../constant'

import { useMutation } from "@tanstack/react-query";
import { CircularProgress } from '@mui/material'
import Mininav from '../../Mininav'
import Nav from '../../Nav'
import Footer from '../../Footer'


const Register = () => {

    const context = useContext(StatesContext)
    const { handleStateChange } = context


    const [options, setoptions] = useState('Account Type')
    const [openDropDown, setopenDropDown] = useState(false)

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dropDownRef = useRef();

    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: (newData) => {
            return fetch(`${BACKEND_URL}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
        },

        async onSuccess(data) {
            let res = await data.json()

            if (res.success) {
                navigate(`/verify`, { state: { userId: res.data.userId, email } });
            } else {
                handleStateChange({ error: res.message })
            }
        },


    })


    const handleSubmit = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            handleStateChange({ error: 'Passwords do not match' })
            return
        }

        if (options === 'Account Type') {
            handleStateChange({ error: 'Please select account type' })
            return
        }

        mutation.mutate({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            user_type: options,
        })
    }



    // Event listener to detect clicks outside the dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setopenDropDown(false); // Close network dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div>
            <Mininav />
            <Nav />
            <div className=' flex justify-center items-center px-[20px] py-[30px]'>

                <div className=' w-[400px] rounded-[15px] px-[20px]'
                    style={{
                        background: 'linear-gradient(133.32deg, rgba(100, 104, 123, 0.3) -1.08%, rgba(37, 38, 43, 0.3) 100%, rgba(92, 92, 134, 0.3) 100.01%)',
                        borderWidth: '0.77px 0.77px 0px 0.77px',
                        borderStyle: 'solid',
                        borderColor: '#FFFFFF40'
                    }}
                >

                    <h2 className='text-center text-[#66FCF1] font-bold text-[30px] font-r pt-[30px]'>
                        Register
                    </h2>

                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className='mt-[35px] space-y-[20px]'>

                        <InputFeild
                            placeholder={'First Name'}
                            value={firstName}
                            onChange={setFirstName}
                            required={true}
                        />
                        <InputFeild
                            placeholder={'Last Name'}
                            value={lastName}
                            onChange={setLastName}
                            required={true}
                        />
                        <InputFeild
                            placeholder={'Email'}
                            value={email}
                            onChange={setEmail}
                            required={true}
                            type={'email'}
                        />

                        <div className='space-y-[10px] relative z-30' ref={dropDownRef}>

                            <div
                                className={`relative z-20 flex select-none bg-[#3D404B] h-[42px] w-full cursor-pointer justify-between gap-[15px] px-[15px] items-center rounded-[12px] `}

                                onClick={() => setopenDropDown(!openDropDown)}


                            >
                                <p
                                    className={`text-[13px] capitalize font-normal  ${options === 'Account Type' ? 'text-gray-400' : 'text-white'} font-bold '`}
                                >
                                    {options}
                                </p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 10 6" fill="none">
                                    <path d="M9.77907 1.04697C9.77941 1.14896 9.7569 1.24973 9.71319 1.34188C9.66948 1.43403 9.60568 1.51521 9.52647 1.57946L5.4304 4.8768C5.30825 4.97721 5.15502 5.0321 4.9969 5.0321C4.83877 5.0321 4.68555 4.97721 4.5634 4.8768L0.467322 1.46341C0.327908 1.34753 0.240235 1.18102 0.223592 1.0005C0.206948 0.819981 0.262697 0.640244 0.378574 0.50083C0.494451 0.361415 0.660964 0.273743 0.841483 0.257099C1.022 0.240456 1.20174 0.296205 1.34115 0.412081L5.00031 3.46366L8.65947 0.514483C8.75968 0.431003 8.8817 0.377975 9.0111 0.361672C9.1405 0.34537 9.27187 0.366477 9.38965 0.422494C9.50743 0.478512 9.6067 0.567097 9.67571 0.677766C9.74472 0.788436 9.78059 0.916558 9.77907 1.04697Z" fill="white" />
                                </svg>

                                {openDropDown && (
                                    <div className="absolute top-[37px] left-0 right-0 z-20 bg-[#3D404B]"
                                        style={{
                                            borderBottomLeftRadius: openDropDown && '5px',
                                            borderBottomRightRadius: openDropDown && '5px',
                                            borderTopColor: 'transparent',
                                        }}
                                    >
                                        <p
                                            className='text-[10px] sm:text-[12px] text-gray-300 duration-500  hover:bg-[rgba(225,225,225,0.09)] font-normal m-[7px] rounded-[7px] px-[16px] py-[8px] '
                                            onClick={() => setoptions('enthusiastic')}
                                        >
                                            enthusiastic
                                        </p>
                                        <p
                                            className='text-[10px] sm:text-[12px] text-gray-300 duration-500  hover:bg-[rgba(225,225,225,0.09)] font-normal m-[7px] rounded-[7px] px-[16px] py-[8px] '
                                            onClick={() => setoptions('professional')}
                                        >
                                            professional
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <InputFeild
                            placeholder={'Phone Number'}
                            type={'number'}
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            required={true}
                        />
                        <InputFeild
                            placeholder={'Password'}
                            password={true}
                            value={password}
                            onChange={setPassword}
                        />
                        <InputFeild
                            placeholder={'Confirm Password'}
                            password={true}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />


                        <div className='pt-[20px] '>
                            <button type='submit' className='text-white cursor-pointer w-full h-[35px] font-r text-[14px]  rounded-[20px]'
                                style={{
                                    borderWidth: '2.31px 0px 2.31px 0px',
                                    borderStyle: 'solid',
                                    borderColor: '#66FCF1'
                                }}
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? <CircularProgress sx={{ color: 'white' }} size={18} /> : 'Submit'}
                            </button>
                        </div>

                        <h2 className='text-white pb-[30px] pt-[10px] text-center font-r text-[12px] font-medium'>
                            Already a registered member? <span className='text-[#66FCF1] cursor-pointer underline underline-offset-4' onClick={() => navigate('/login')}>Login</span>
                        </h2>

                    </form>

                </div>

            </div >
            <Footer />
        </div >
    )
}

export default Register