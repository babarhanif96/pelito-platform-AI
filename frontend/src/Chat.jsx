import React from 'react'
import hrf from './assets/Frame 5 (3).png'
import gty from './assets/Rectangle 934 (1).png'
import f1 from './assets/01.png'
import f2 from './assets/02.png'
import f3 from './assets/03.png'
import f4 from './assets/04.png'
import f5 from './assets/05.png'

const Chat = () => {
    return (
        <>
            <div className='relative flex justify-end'>
                <img className='h-[250px] md:h-[329px] md:w-full' src={hrf} alt="" />
                <div>
                    <img className='h-[250px] lg:h-[330px] xl:h-[332px] w-full absolute right-[1rem]' src={gty} alt="" />
                </div>
                <div className='absolute left-[2rem] md:left-[5rem] top-[8em]'>
                    <h1 className='text-[40px] md:text-[70px] text-white tracking-widest font-m'>Contact Us</h1>
                </div>
            </div>
            <div className='bg-[#202022] flex md:flex-row flex-col gap-4 md:gap-0 justify-between items-center px-4 lg:px-4 xl:px-24 py-10'>
                <div className='flex flex-col gap-6 px-2'>
                    <div>
                        <h1 className='text-[40px] lg:text-[60px] font-m text-white'>Have Questions? <br /> Let’s Chat!</h1>
                        <p className='text-[12px] lg:text-[15px] body text-white'>For support or inquiries, contact us directly by email. Our team is always ready to help.</p>
                    </div>
                    <div>
                        <p className='text-[15px] body text-white cursor-pointer'
                            onClick={() => window.location.href = 'mailto:support@pelito.net'}
                        >Email: support@pelito.net</p>
                        {/* <p className='text-[15px] body text-white'>Phone Number: (04) 491 560 110</p> */}
                    </div>
                    {/* <button className='text-[19px] rounded-full slow border-cyan-400 text-white py-2 font-bold  bg-[#202022] hover:bg-cyan-400 hover:text-black transition-all'>Contact Us</button> */}
                </div>

            </div>
            <div className='flex md:flex-row flex-col'>
                <img className='w-full md:w-[220px] h-[288px]' src={f1} alt="" />
                <img src={f2} alt="" />
                <img src={f3} alt="" />
                <img src={f4} alt="" />
                <img src={f5} alt="" />
            </div>
        </>
    )
}

export default Chat
