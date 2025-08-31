import { useContext } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import StatesContext from '../../context/StatesContext'
import { useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constant'

const UserGuide = () => {

    const queryClient = useQueryClient()

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const handleClaimAirdrop = async () => {
        try {

            handleStateChange({ loader: 'Claiming' })

            const token = localStorage.getItem('token')
            const response = await fetch(`${BACKEND_URL}/user/claim-airdrop`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            await response.json()

            handleStateChange({ success: 'Airdrop claimed successfully!' })

        } catch (error) {
            console.log('Error claiming airdrop:', error)
            handleStateChange({ error: 'Failed to claim airdrop' })

        } finally {
            handleStateChange({ loader: '' })
            queryClient.invalidateQueries('user')
        }
    }


    return (
        <div className=''>

            <Nav />
            <SideBar />

            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Getting Started' />

                    <div className=' mt-[40px] sm:mt-[60px] mx-auto'>
                        <div className='relative px-[20px]'>
                            <div className=' w-full rounded-[20px] relative '>
                                <div className="bg-[#141414] relative z-10 rounded-[20px] px-[10px] lg:px-[20px] py-[20px] h-full">

                                    <h2 className='text-white text-[20px] sm:text-[24px] font-bold'>
                                        How to Use the Platform
                                    </h2>
                                    <p className='text-gray-200 text-[12px] sm:text-[14px]'>
                                        Follow these simple steps to set up your salon and start receiving bookings:
                                    </p>

                                    <div className='mt-[15px] space-y-[10px]'>

                                        <div>
                                            <h2 className='text-white text-[16px] sm:text-[18px] font-bold'>
                                                Step 1: Complete Your Profile
                                            </h2>
                                            <p className='text-gray-200 text-[12px] sm:text-[14px]'>
                                                Update your profile with basic salon details such as name, location, description, and contact information. This helps customers know who you are.
                                            </p>
                                        </div>

                                        <div className=''>
                                            <h2 className='text-white text-[16px] sm:text-[18px] font-bold'>
                                                Step 2: Add Your Services
                                            </h2>
                                            <p className='text-gray-200 text-[12px] sm:text-[14px]'>
                                                List the services your salon offers—like haircuts, facials, massages, etc. Be sure to include pricing, duration, and any special notes.
                                            </p>
                                        </div>

                                        <div className=''>
                                            <h2 className='text-white text-[16px] sm:text-[18px] font-bold'>
                                                Step 3: Add Salon Team Members
                                            </h2>
                                            <p className='text-gray-200 text-[12px] sm:text-[14px]'>
                                                Add the staff or professionals working in your salon. Each member can have their own profile and assigned services.
                                            </p>
                                        </div>

                                        <div className=''>
                                            <h2 className='text-white text-[16px] sm:text-[18px] font-bold'>
                                                Step 4: Set Availability
                                            </h2>
                                            <p className='text-gray-200 text-[12px] sm:text-[14px]'>
                                                Configure the working hours and availability for each team member, so clients can book at the right time.
                                            </p>
                                        </div>

                                        <div className=''>
                                            <h2 className='text-white text-[16px] sm:text-[18px] font-bold'>
                                                Step 5: You're Ready to Go!
                                            </h2>
                                            <p className='text-gray-200 text-[12px] sm:text-[14px]'>
                                                You're all set to start receiving payments. If you prefer crypto, you can accept payments in cryptocurrency, and the funds will be automatically transferred to the user's wallet. Alternatively, if you'd rather use traditional payment methods, you can connect your Stripe account in the settings to start accepting card payments.
                                            </p>
                                        </div>

                                    </div>


                                </div>

                                <div className='absolute inset-[-2px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[20px]' />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default UserGuide
