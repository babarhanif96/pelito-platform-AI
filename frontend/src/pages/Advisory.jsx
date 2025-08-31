import React, { useContext, useEffect, useRef, useState } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Nav from '../components/Nav'
import SideBar from '../components/Sidebar'

import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { CircularProgress } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import InputFeild from '../components/ui/InputFeild'
import { BACKEND_URL } from '../constant'
import StatesContext from '../context/StatesContext'



const Advisory = () => {

    const context = useContext(StatesContext)
    const { handleStateChange } = context

    const [options, setoptions] = useState('Tax')
    const [openDropDown, setopenDropDown] = useState(false)

    const [firstName, setfirstName] = useState('')
    const [secondName, setsecondName] = useState('')
    const [msg, setMsg] = useState("");
    const [email, setEmail] = useState("");

    const dropDownRef = useRef();

    const mutation = useMutation({
        mutationFn: (newData) => {
            return fetch(`${BACKEND_URL}/user/inquiry-email`, {
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

                handleStateChange({ success: 'Inquiry created successfully' })

                setfirstName('')
                setMsg('')
                setEmail('')
                setsecondName('')

            } else {
                handleStateChange({ error: res.message })
            }
        },
        onError(error) {
            console.log(error)
        }


    })


    const handleSubmit = (e) => {
        e.preventDefault()

        mutation.mutate({
            name: firstName + ' ' + secondName,
            msg,
            email,
            subject_type: options
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
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[60px] sm:pb-[20px]'>
                    <DashboardHeader title='Advisory' />

                    <div className='mt-[20px] sm:mt-[40px]'>
                        <h2 className='text-white font-r text-center sm:text-left text-[22px] sm:text-[32px] font-bold'>
                            How Can We Help?
                        </h2>
                        <form onSubmit={(e) => handleSubmit(e)}>

                            <div className='sm:grid  sm:grid-cols-2 lg:grid-cols-3 mt-[30px] space-y-[20px] sm:space-y-0 sm:gap-[25px]'>
                                <div>
                                    <h2 className='text-white pb-[10px] font-r font-normal text-[14px] sm:text-[16px]'>
                                        First Name
                                    </h2>
                                    <InputFeild
                                        isContact={true}
                                        placeholder={'Enter First Name'}
                                        value={firstName}
                                        onChange={setfirstName}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <h2 className='text-white pb-[10px] font-r font-normal text-[14px] sm:text-[16px]'>
                                        Last Name
                                    </h2>
                                    <InputFeild
                                        isContact={true}
                                        placeholder={'Enter Last Name'}
                                        value={secondName}
                                        onChange={setsecondName}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <h2 className='text-white pb-[10px] font-r font-normal text-[14px] sm:text-[16px]'>
                                        Email
                                    </h2>
                                    <InputFeild
                                        isContact={true}
                                        placeholder={'Enter Email'}
                                        value={email}
                                        onChange={setEmail}
                                        required={true}
                                        type={'email'}
                                    />
                                </div>

                                <div>
                                    <h2 className='text-white pb-[10px] font-r font-normal text-[14px] sm:text-[16px]'>
                                        Subject
                                    </h2>
                                    <div className='space-y-[10px] relative z-30' ref={dropDownRef}>

                                        <div
                                            className={`relative z-20 flex select-none bg-[#141414] h-[42px] sm:h-[52px] w-full cursor-pointer justify-between gap-[15px] px-[20px] sm:px-[25px] items-center rounded-[7px] `}

                                            onClick={() => setopenDropDown(!openDropDown)}


                                        >
                                            <p
                                                className={`text-[13px] font-normal font-r text-white capitalize '`}
                                            >
                                                {options}
                                            </p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 10 6" fill="none">
                                                <path d="M9.77907 1.04697C9.77941 1.14896 9.7569 1.24973 9.71319 1.34188C9.66948 1.43403 9.60568 1.51521 9.52647 1.57946L5.4304 4.8768C5.30825 4.97721 5.15502 5.0321 4.9969 5.0321C4.83877 5.0321 4.68555 4.97721 4.5634 4.8768L0.467322 1.46341C0.327908 1.34753 0.240235 1.18102 0.223592 1.0005C0.206948 0.819981 0.262697 0.640244 0.378574 0.50083C0.494451 0.361415 0.660964 0.273743 0.841483 0.257099C1.022 0.240456 1.20174 0.296205 1.34115 0.412081L5.00031 3.46366L8.65947 0.514483C8.75968 0.431003 8.8817 0.377975 9.0111 0.361672C9.1405 0.34537 9.27187 0.366477 9.38965 0.422494C9.50743 0.478512 9.6067 0.567097 9.67571 0.677766C9.74472 0.788436 9.78059 0.916558 9.77907 1.04697Z" fill="white" />
                                            </svg>

                                            {openDropDown && (
                                                <div className="absolute top-[37px] left-0 right-0 z-20 bg-[#141414]"
                                                    style={{
                                                        borderBottomLeftRadius: openDropDown && '5px',
                                                        borderBottomRightRadius: openDropDown && '5px',
                                                        borderTopColor: 'transparent',
                                                    }}
                                                >
                                                    <p
                                                        className='text-[10px] sm:text-[12px] text-gray-300 duration-500  hover:bg-[rgba(225,225,225,0.09)] font-normal m-[7px] rounded-[7px] px-[16px] py-[8px] '
                                                        onClick={() => setoptions('Tax')}
                                                    >
                                                        Tax
                                                    </p>
                                                    <p
                                                        className='text-[10px] sm:text-[12px] text-gray-300 duration-500  hover:bg-[rgba(225,225,225,0.09)] font-normal m-[7px] rounded-[7px] px-[16px] py-[8px] '
                                                        onClick={() => setoptions('HR')}
                                                    >
                                                        HR
                                                    </p>

                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                <div className='col-span-2'>
                                    <h2 className='text-white pb-[10px] font-r font-normal text-[14px] sm:text-[16px]'>
                                        Your Message
                                    </h2>
                                    <InputFeild
                                        isContact={true}
                                        placeholder={'Try to do not exceed 300 character'}
                                        value={msg}
                                        onChange={setMsg}
                                        required={true}
                                    />
                                </div>

                            </div>

                            <div className='flex justify-center sm:justify-end mt-[25px]'>
                                <button type='submit'
                                    disabled={mutation.isPending}
                                    className='w-[100px] sm:w-[129px] h-[40px] sm:h-[57px] flex items-center justify-center gap-[5px] rounded-[8px] bg-[#009688] font-r text-white font-bold text-[14px] sm:text-[18px]'>
                                    {mutation.isPending ? <CircularProgress sx={{ color: 'white' }} size={24} /> : (<>
                                        Sumbit <ArrowRightIcon className='text-white h-[14px] sm:h-[18px]' />
                                    </>)}
                                </button>
                            </div>

                        </form>

                    </div>


                </div>


            </div>

        </div>
    )
}

export default Advisory