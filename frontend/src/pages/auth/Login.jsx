import React, { useContext, useEffect, useRef, useState } from 'react'
import InputFeild from '../../components/ui/InputFeild'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { CircularProgress } from '@mui/material'
import Mininav from '../../Mininav'
import Nav from '../../Nav'
import Footer from '../../Footer'

const Login = () => {

    const context = useContext(StatesContext)
    const { handleStateChange } = context

    const [options, setoptions] = useState('Account Type')
    const [openDropDown, setopenDropDown] = useState(false)

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const dropDownRef = useRef();

    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: (newData) => {
            return fetch(`${BACKEND_URL}/user/login`, {
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
                if (res.token) {

                    handleStateChange({ user: res.user })
                    localStorage.setItem('LoggedInTime', new Date().getTime())
                    localStorage.setItem('authUser', JSON.stringify(res.user));
                    localStorage.setItem('token', res.token);


                    if (res.user.user_type === 'professional') {
                        navigate('/professional/news-feed')
                    } else {
                        if (res.user.user_type === 'admin') {
                            navigate('/admin/news-feed')
                        } else {

                            navigate('/dashboard')
                        }
                    }

                } else {
                    navigate(`/verify`, { state: { userId: res.data.userId, email } });
                }
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
            email,
            password,
            user_type: options
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
            <div className='min-h-[90vh] flex justify-center items-center px-[20px] py-[30px]'>

                <div className=' w-[400px] rounded-[15px] px-[20px]'
                    style={{
                        background: 'linear-gradient(133.32deg, rgba(100, 104, 123, 0.3) -1.08%, rgba(37, 38, 43, 0.3) 100%, rgba(92, 92, 134, 0.3) 100.01%)',
                        borderWidth: '0.77px 0.77px 0px 0.77px',
                        borderStyle: 'solid',
                        borderColor: '#FFFFFF40'
                    }}
                >

                    <h2 className='text-center text-[#66FCF1] font-bold text-[30px] font-r pt-[30px]'>
                        Login
                    </h2>

                    <form onSubmit={(e) => handleSubmit(e)} className='mt-[35px] space-y-[20px]'>
                        <InputFeild
                            placeholder={'Email'}
                            value={email}
                            onChange={setemail}
                            required={true}
                            type={'email'}
                        />


                        <div>
                            <InputFeild
                                placeholder={'Password'}
                                password={true}
                                value={password}
                                onChange={setpassword}
                                required={true}
                            />

                            <div
                                className="flex justify-end"

                            >
                                <div className="cursor-pointer">
                                    <h2
                                        onClick={() => {
                                            navigate(`/forgot`)
                                        }}
                                        className=" text-gray-200 text-[12px]  font-semibold pt-[7px]">
                                        Forgot password?
                                    </h2>
                                </div>

                            </div>
                        </div>


                        <div className='pt-[20px] '>
                            <button
                                type='submit'
                                className='text-white cursor-pointer w-full h-[35px] font-r text-[14px]  rounded-[20px]'
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
                            Not a registered member? <span className='text-[#66FCF1] cursor-pointer underline underline-offset-4' onClick={() => navigate('/register')}>Register</span>
                        </h2>

                    </form>

                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Login