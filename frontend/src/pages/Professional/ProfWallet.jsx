import React, { useContext, useEffect, useState } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import StatesContext from '../../context/StatesContext'
import InputFeild from '../../components/ui/InputFeild'
import { ethers } from 'ethers'
import { BACKEND_URL, RPC_URL, TOKEN_ABI, TOKEN_ADDRESS } from '../../constant'
import { useMutation } from '@tanstack/react-query'
import { CircularProgress } from '@mui/material'



const ProfWallet = () => {

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const [receipent, setreceipent] = useState('')
    const [amount, setamount] = useState('')
    const [balance, setbalance] = useState(0)

    const handleSumbit = (e) => {
        e.preventDefault()

        if (balance < amount) {
            handleStateChange({ error: 'Insufficient Balance' })
            return
        }


        if (!ethers.utils.isAddress(receipent)) {
            return handleStateChange({ error: "Invalid wallet address" });
        }

        mutation.mutate({ receipent, amount, user_id: state.user._id })
    }

    const FetchBalance = async () => {


        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

        // Create contract instance
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
        const value = await tokenContract.balanceOf(state.user.address)

        setbalance(Number((ethers.utils.formatUnits(value.toString(), 6).toString())));

    }

    const mutation = useMutation({
        mutationFn: (newData) => {

            const token = localStorage.getItem('token');

            return fetch(`${BACKEND_URL}/user/send-crypto`, {
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

                setreceipent('')
                setamount('')

                handleStateChange({ success: "Token sent successfully" })

                FetchBalance()

            } else {
                handleStateChange({ error: res.message })
            }
        },
        onError(error) {
            console.log(error)
        }


    })

    useEffect(() => {
        FetchBalance()
    }, [])


    return (
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Crypto Wallet' />

                    <div className='mt-[40px] sm:mt-[60px] flex justify-center'>

                        <div className='bg-[#141414] w-[500px] p-[30px] rounded-[12px]'>

                            <h2 className='text-white font-r text-[22px] sm:text-[24px]  text-center font-bold'>
                                Wallet Address
                            </h2>
                            <h2 className='text-white font-r text-[11px] sm:text-[12px]  text-center'>
                                {state.user.address}
                            </h2>

                            <form onSubmit={(e) => handleSumbit(e)} className='mt-[30px] space-y-[15px]'>


                                <InputFeild
                                    isSetting={true}
                                    placeholder={'Receipent Address'}
                                    required={true}
                                    value={receipent}
                                    onChange={setreceipent}
                                />
                                <InputFeild
                                    isSetting={true}
                                    placeholder={'Enter Token Amount'}
                                    type={'number'}
                                    required={true}
                                    value={amount}
                                    onChange={setamount}
                                />

                                <div className='flex px-[3px] pb-[20px] justify-between items-center'>
                                    <h2 className='text-white font-n text-[12px] font-semibold'>
                                        My Balance:
                                    </h2>
                                    <h2 className='text-white font-n text-[12px] font-semibold'>
                                        {Number(balance).toFixed(2)} Token
                                    </h2>
                                </div>


                                <button
                                    type='submit'
                                    disabled={mutation.isPending}
                                    className='bg-[#009688] text-white font-r font-semibold text-[12px] sm:text-[14px] w-full h-[32px] sm:h-[35px] rounded-[7px]'>
                                    {mutation.isPending ? <CircularProgress sx={{ color: 'white' }} size={18} /> : 'Send Crypto'}
                                </button>

                            </form>

                        </div>

                    </div>


                </div>


            </div>

        </div>
    )
}

export default ProfWallet