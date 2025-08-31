import { useContext } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Nav from '../components/Nav'
import SideBar from '../components/Sidebar'
import StatesContext from '../context/StatesContext'
import { useQueryClient } from '@tanstack/react-query'
import { AIRDROP_ABI, AIRDROP_ADDRESS, BACKEND_URL } from '../constant'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { ethers } from 'ethers'

const Airdrop = () => {

    const queryClient = useQueryClient()

    const { open: modalOpen } = useAppKit();
    const { address } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider("eip155");

    const context = useContext(StatesContext)
    const { state, handleStateChange } = context

    const handleClaimAirdrop = async () => {
        if (!address) {
            modalOpen();
            return;
        }

        if (!walletProvider) {
            console.error("Wallet provider not found");
            return;
        }

        try {
            handleStateChange({ loader: 'Claiming' });

            const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
            const signer = ethersProvider.getSigner();
            const contract = new ethers.Contract(AIRDROP_ADDRESS, AIRDROP_ABI, signer);

            const tx = await contract.claimAirdrop();
            await tx.wait(1); 

            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/user/claim-airdrop`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            await response.json();

            handleStateChange({ success: 'Airdrop claimed successfully!' });
            queryClient.invalidateQueries('user');


        } catch (error) {
            console.error('Error claiming airdrop:', error?.reason || error?.message || error);
            handleStateChange({ error: 'Failed to claim airdrop' });
        } finally {
            handleStateChange({ loader: '' });
        }
    };



    return (
        <div className=''>

            <Nav />
            <SideBar />

            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Airdrop' />

                    <div className=' mt-[40px] sm:mt-[60px] max-w-[500px] mx-auto'>
                        <div className='relative '>
                            <div className=' w-full rounded-[20px] relative '>
                                <div className="bg-[#141414] relative z-10 rounded-[20px] px-[10px] lg:px-[20px] py-[30px] h-full">

                                    {state.user.IsAirdropClaimed ? (
                                        <>
                                            <h2 className='text-white text-center text-[20px] font-bold'>
                                                Airdrop Already Claimed
                                            </h2>
                                            <p className='text-gray-200 text-[16px] text-center'>
                                                You have already claimed your airdrop tokens. Thank you!
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className='text-white text-center text-[20px] font-bold'>
                                                Claim Your Airdrop Now
                                            </h2>
                                            <p className='text-gray-200 text-[16px] text-center'>
                                                Don't miss out on this opportunity to get free tokens!
                                            </p>

                                            <div className='flex justify-center mt-[20px]'>
                                                <button
                                                    onClick={handleClaimAirdrop}
                                                    className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>
                                                    Claim Now
                                                </button>
                                            </div>
                                        </>
                                    )}

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

export default Airdrop
