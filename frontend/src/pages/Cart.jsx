import React, { useState } from 'react'
import CartServices from '../sections/Cart/CartServices'
import CartProducts from '../sections/Cart/CartProducts'
import Mininav from '../Mininav'
import Nav from '../Nav'
import Footer from '../Footer'

const investmentType = ['Service', 'Product']

const Cart = () => {



    const [activeType, setactiveType] = useState(investmentType[0])
    const [open, setopen] = useState(false)

    return (
        <div>
            <Mininav />
            <Nav />
            <div className='w-full h-full bg-[#141414] min-h-screen'>
                <div className='max-w-[1263px] px-[20px] mx-auto pt-[100px] pb-[40px]'>

                    <div className='flex justify-center'>

                        <div className='relative z-0 flex justify-center  items-center h-[52px] px-[7px] rounded-[15px]'
                            style={{
                                background: 'rgba(255,255,255,0.09)'
                            }}
                        >
                            <div className='flex'>
                                {investmentType.map((item, i) => (
                                    <div key={i} >
                                        <div className={` w-[130px] md:w-[250px] `} onClick={() => setactiveType(item)}>
                                            <button className={`rounded-[6px] w-full text-[14px] font-medium h-[34px] ${activeType === item ? 'text-white' : ' text-[#93A4BD]'} `}
                                                style={{
                                                    background: activeType === item && '#009688'

                                                }}
                                            >
                                                {item}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {activeType === 'Service' ? <CartServices /> : <CartProducts />}

                </div>
            </div>

            <Footer />

        </div>
    )
}

export default Cart