import React, { useContext, useEffect, useRef, useState } from 'react'
import InputFeild from '../../components/ui/InputFeild'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'
import StatesContext from '../../context/StatesContext'
import { CircularProgress } from '@mui/material'
import Mininav from '../../Mininav'
import Nav from '../../Nav'
import Footer from '../../Footer'

const Forgot = () => {

    const context = useContext(StatesContext)
    const { handleStateChange } = context

    const [email, setemail] = useState('')

    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: (newData) => {
            return fetch(`${BACKEND_URL}/user/forgot-password`, {
                method: 'PUT',
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

                console.log(res)

                navigate(`/reset`, { state: { userId: res.user_id } });

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
            email
        })
    }




    return (
        <div>
            <Mininav />
            <Nav />
            <div className='min-h-[70vh] flex justify-center items-center px-[20px] py-[30px]'>

                <div className=' w-[400px] rounded-[15px] px-[20px]'
                    style={{
                        background: 'linear-gradient(133.32deg, rgba(100, 104, 123, 0.3) -1.08%, rgba(37, 38, 43, 0.3) 100%, rgba(92, 92, 134, 0.3) 100.01%)',
                        borderWidth: '0.77px 0.77px 0px 0.77px',
                        borderStyle: 'solid',
                        borderColor: '#FFFFFF40'
                    }}
                >

                    <h2 className='text-center text-[#66FCF1] font-bold text-[30px] font-r pt-[30px]'>
                        Reset Password
                    </h2>

                    <p className='text-gray-200 text-[13px] md:text-[15px] text-center pt-[20px] sm:pt-[10px]'>
                        Enter your email address below, and we’ll send you an OTP to reset your password.
                    </p>

                    <form onSubmit={(e) => handleSubmit(e)} className='mt-[45px] mb-[30px] space-y-[20px]'>
                        <InputFeild
                            placeholder={'Email'}
                            value={email}
                            onChange={setemail}
                            required={true}
                            type={'email'}
                        />


                        <div className=' '>
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


                    </form>

                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Forgot