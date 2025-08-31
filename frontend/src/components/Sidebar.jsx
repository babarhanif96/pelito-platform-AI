import { useLocation, useNavigate } from 'react-router-dom';

import { useContext } from 'react';
import logo from '../assets/sidebarLogo.png';
import StatesContext from '../context/StatesContext';
import { ADMIN_NAV_DATA, CUSTOMER_NAV_DATA, FRONTEND_URL, PROFESSIONAL_NAV_DATA } from '../constant';
import LogoutIcon from '@mui/icons-material/Logout';

const SideBar = () => {

    const context = useContext(StatesContext)
    const { state, handleLogout, handleStateChange } = context

    const { pathname } = useLocation()
    const navigate = useNavigate()



    return (
        <div className="hidden md:block fixed top-0 left-0 bottom-0 z-40">


            <div className="w-[230px] lg:w-[270px] h-full bg-[#141414] flex flex-col">

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto max-h-full relative">

                    <div className='flex justify-center pt-[55px]'>
                        <img src={logo} alt="" className='h-[95px] cursor-pointer'
                            onClick={() => navigate('/')}
                        />
                    </div>

                    <div className='pt-[10px] px-[25px]'>
                        <div className='mt-[30px] space-y-[12px]'>
                            {(state.user.user_type === 'professional' ? PROFESSIONAL_NAV_DATA : state.user.user_type === 'admin' ? ADMIN_NAV_DATA : CUSTOMER_NAV_DATA).map((item, index) => (
                                <div key={index} className='relative'>
                                    <div className={`flex gap-[10px] px-[10px] rounded-[7px] items-center cursor-pointer hover:bg-[#009688] duration-500 ${pathname.includes(item.route) ? 'bg-[#009688]' : 'bg-transparent'}`}
                                        onClick={() => {
                                            if (!item.route) {

                                                if (!state.user.salon_name) {
                                                    handleStateChange({ error: 'Please complete your profile' })
                                                    navigate('/professional/settings')
                                                    return
                                                }

                                                const formattedSalonName = state.user.salon_name.trim().toLowerCase().replace(/\s+/g, "-")
                                                navigate(`/${formattedSalonName}`)

                                                return

                                            } else {
                                                navigate(item.route)
                                            }
                                        }}
                                    >
                                        {item.img ? (
                                            <img src={item.img} alt="" className='h-[19px] w-[19px]' />
                                        ) : (
                                            <item.icon sx={{ color: 'white', height: '19px', width: '19px' }} />
                                        )}

                                        <div className='grow flex gap-[7px] items-center  py-[7px]'>
                                            <h2 className="text-white font-n text-[16px] font-normal">
                                                {item.title}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Logout Button - Always Stays at Bottom */}
                <div className='px-[25px] py-4'>
                    <div className="flex gap-[10px] px-[10px] rounded-[7px] items-center cursor-pointer hover:bg-[#009688] duration-500"
                        onClick={handleLogout}
                    >
                        <LogoutIcon sx={{ color: 'white', height: '19px', width: '19px' }} />
                        <div className='grow flex gap-[7px] items-center py-[7px]'>
                            <h2 className="text-white font-n text-[16px] font-normal">
                                Logout
                            </h2>
                        </div>
                    </div>
                </div>

            </div>

        </div >
    )
}

export default SideBar