import { Bars3BottomRightIcon, WalletIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import cart from '../assets/cart.png';

import StatesContext from '../context/StatesContext';
import { ADMIN_NAV_DATA, CUSTOMER_NAV_DATA, PROFESSIONAL_NAV_DATA } from '../constant';
import { textVariant } from '../utils';
import LogoutIcon from '@mui/icons-material/Logout';




const MobNav = () => {


    const context = useContext(StatesContext)
    const { state, handleLogout } = context

    const [isOpen, setisOpen] = useState(false)


    const navigate = useNavigate()
    const { pathname } = useLocation()



    return (
        <div className='block lg:hidden relative'>

            <div className='flex items-center justify-between'>
                <img src={logo} alt="logo" className='h-[40px]'
                    onClick={() => navigate('/')}
                />

                <div className='flex items-center gap-[15px]'>

                    <img src={cart} alt="" className='h-[20px] cursor-pointer'
                        onClick={() => navigate('/cart')}
                    />

                    <div className='bg-[#25262B] flex rounded-[20px] items-center gap-[10px] py-[5px] pl-[5px] pr-[20px] cursor-pointer'
                        onClick={() => navigate('/professional/settings')}
                    >
                        <img
                            src={'https://res.cloudinary.com/doytf8ce3/image/upload/v1693086923/dummy_fxiudh.jpg'}
                            className='w-[29px] h-[29px] rounded-[20px]'
                            alt=""
                        />
                        <h2 className='font-n text-[14px] font-semibold text-white'>
                            {state.user.first_name} {state.user.last_name}
                        </h2>
                    </div>


                    <div className={`h-[38px] w-[38px] bg-[#009688] rounded-full flex justify-center items-center `}
                        onClick={() => {
                            setisOpen(true)
                        }}
                    >
                        <Bars3BottomRightIcon className='h-[23px] text-white' />
                    </div>

                </div>


            </div>

            {isOpen && (

                <div className='fixed inset-0 bg-[#141414] px-[20px] py-[15px]'>
                    <div className='relative h-full'>
                        <div className='flex justify-between items-center'>
                            <img src={logo} alt="logo" className='h-[40px]' />

                            <div className='flex items-center gap-[10px]'>

                                <div className='h-[38px] w-[38px] bg-[#009688] rounded-full flex justify-center items-center'
                                    onClick={() => {
                                        setisOpen(false)
                                    }}
                                >
                                    <XMarkIcon className='h-[23px] text-white' />
                                </div>
                            </div>

                        </div>
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className='lg:pt-[90px]'
                        >
                            <div className='mt-[40px] flex flex-col gap-[25px] max-h-[400px] overflow-y-auto'>
                                {(state.user.user_type === 'professional' ? PROFESSIONAL_NAV_DATA : state.user.user_type === 'admin' ? ADMIN_NAV_DATA : CUSTOMER_NAV_DATA).map((item, i) => {

                                    return <motion.a
                                    key={i}
                                    variants={textVariant(0.2 * (i + 1))}
                                    className={'text-[23px] font-bold text-center text-white list-none'}
                                    viewport={{ once: true }}
                                    onClick={() => {

                                        navigate(item.route)
                                        setisOpen(false)

                                    }}
                                >
                                    {item.title}
                                </motion.a>
                                })}

                            </div>
                        </motion.div>


                        <div className='absolute bottom-[20px] left-0 right-0 '>
                            <motion.div
                                whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                                transition={{ duration: 1.2, ease: 'easeInOut' }}
                                initial='hidden'
                                style={{ opacity: 0 }}
                                viewport={{ once: true }}
                            >

                                <div
                                    className='flex flex-col gap-[20px]'
                                >
                                    <button className='text-white text-[19px] flex justify-center gap-[10px] items-center h-[45px] w-full font-semibold rounded-[10px] bg-[#009688]'
                                        onClick={() => {

                                            handleLogout()
                                            setTimeout(() => {
                                                setisOpen(false)
                                            }, 2000);
                                        }}
                                    >
                                        <LogoutIcon sx={{ color: 'white', height: '19px', width: '19px' }} /> Logout

                                    </button>

                                </div>


                            </motion.div>
                        </div>


                    </div>
                </div>
            )}

        </div>

    )
}

export default MobNav