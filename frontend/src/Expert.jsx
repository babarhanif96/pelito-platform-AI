import React from 'react'
import star from './assets/Star 3.png'
import mouth from './assets/moustache 2.png'
import get from './assets/img.png'
import fed from './assets/facebook.png'
import dws from './assets/twitter.png'
import vre from './assets/instagram (1).png'
import get2 from './assets/img (1).png'
import get3 from './assets/img (2).png'
import sci from './assets/icon scissors.png'
import raz from './assets/icon razor.png'
import bread from './assets/icon beard.png'
import face from './assets/icon facial.png'
import mush from './assets/icon mustache.png'
import hair from './assets/icon hair.png'
import blog from './assets/Mask group.png'
import blog1 from './assets/Mask group (1).png'
import blog2 from './assets/Mask group (2).png'
import elli from './assets/Ellipse 10336.png'
import arow from './assets/Arrow_Down_Left_MD.png'
import cir from './assets/Ellipse 10331.png'
import arrw from './assets/Group 1000015007.png'
import fyt from './assets/634.png'
import bhn from './assets/Path 173.png'
import yui from './assets/12628.png'
import ghy from './assets/14940.png'
import f1 from './assets/01.png'
import f2 from './assets/02.png'
import f3 from './assets/03.png'
import f4 from './assets/04.png'
import f5 from './assets/05.png'
import { useState } from 'react';


const Expert = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <div className='bg-[#141414] pb-[60px] pt-[20px] sm:py-20'>
                <img className='pl-[20px] sm:pl-20' src={star} alt="" />

                <div className='px-[20px] max-w-[1340px] mx-auto mt-[20px] md:mt-0'>
                    <h2 className='md:text-center font-semibold text-[#66FCF1] text-[14px] sm:text-[17px]'>
                        Pelito: Your All-in-One Destination for Hair Industry Triumphs and Tech Advancements!
                    </h2>

                    <p className='text-gray-300 pt-[20px] text-[13px] sm:text-[16px]'>
                        Welcome to Pelito, The Hair Network, where professionals and enthusiasts come together to redefine the standards of excellence in the hair industry. Our platform offers a wealth of resources, tools, and support tailored to meet the diverse needs of hairstylists and barbers worldwide. Whether you're a seasoned professional looking to expand your clientele or an enthusiast eager to explore the latest trends and techniques, Pelito.net is your ultimate destination.<br /><br />And that's not all! We invite you to explore our STEM Programs, where you can discover a range of exciting opportunities to engage with technology, engineering, mathematics, and science. From coding workshops to virtual science fairs, our STEM Programs offer something for everyone. Join us today and unlock the full potential of your career in the hair and fashion industry, while also diving into the fascinating world of STEM!
                    </p>

                    <h2 className=' font-semibold text-[#66FCF1] text-[14px] sm:text-[17px] pt-[20px]'>
                        #PelitoNet #HairRevolution #InnovationInBeauty
                    </h2>

                </div>

                {/* <div className='flex flex-col justify-center items-center'>
                    <img className='' src={mouth} alt="" />
                    <h1 className='text-[30px] md:text-[60px] font-m text-white'>Expert Team</h1>
                    <p className='text-[16px] md:text-[20px] body text-white'>We've lots of Experience Members barbers</p>
                </div> */}
                {/* <div className='flex md:flex-row flex-col items-center justify-between px-3 gap-3 lg:px-10 xl:px-48 py-3 pt-10'>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px]' src={get} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-center'>
                            <h1 className='text-[20px] font-m text-white'>MARLON MCDONALD</h1>
                            <div className='flex gap-3'>
                                <img src={fed} alt="" />
                                <img src={dws} alt="" />
                                <img src={vre} alt="" />
                            </div>
                            <button className='text-[16px] rounded-full slow border-cyan-400 text-white px-12 py-1 font-bold  bg-[#303030] hover:bg-cyan-400 hover:text-black transition-all'>Book</button>
                        </div>
                    </div>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px]' src={get2} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-center'>
                            <h1 className='text-[20px] font-m text-white'>JERRY BANKS</h1>
                            <div className='flex gap-3'>
                                <img src={fed} alt="" />
                                <img src={dws} alt="" />
                                <img src={vre} alt="" />
                            </div>
                            <button className='text-[16px] rounded-full slow border-cyan-400 text-white px-12 py-1 font-bold  bg-[#303030] hover:bg-cyan-400 hover:text-black transition-all'>Book</button>
                        </div>
                    </div>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px]' src={get3} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-center'>
                            <h1 className='text-[20px] font-m text-white'>JOHN BAILEY</h1>
                            <div className='flex gap-3'>
                                <img src={fed} alt="" />
                                <img src={dws} alt="" />
                                <img src={vre} alt="" />
                            </div>
                            <button className='text-[16px] rounded-full slow border-cyan-400 text-white px-12 py-1 font-extrabold  bg-[#303030] hover:bg-cyan-400 hover:text-black transition-all'>Book</button>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* <div className='bg-[#141414] w-full h-[10rem]'></div> */}
            <div className='bg-[#232429] relative pt-20 py-32'>
                <img className='absolute right-[2rem] md:right-[10rem] md:top-[11rem]' src={star} alt="" />
                <div className='flex flex-col justify-center items-center'>
                    <img className='' src={mouth} alt="" />
                    <h1 className='text-[30px] md:text-[60px] font-m text-white'>Our Services</h1>
                    <p className='text-[16px] md:text-[20px] body text-white'>Precision grooming for a polished look</p>
                </div>
                <div className='pt-20 flex flex-col gap-10'>
                    <div className='flex md:flex-row flex-col justify-between items-center gap-20 text-white mm:px-11 lg:px-24 '>
                        <div className='flex flex-col gap-3 rounded-lg w-[300px] mm:w-[328px] md:w-[400px] shadow-all-sides border-[#66FCF1] border-2 h-[323px] justify-center items-center bg-[#2d2e34]'>
                            <img className='w-[55px] h-[75px]' src={sci} alt="" />
                            <h1 className='text-[23px] text-white font-m'>Haircut & Beard Trim</h1>
                            <p className='text-[16px] text-center body'>Precision haircuts and expertly <br /> styled beard trims tailored to your <br /> personality.</p>
                        </div>
                        <div className='flex flex-col gap-3 rounded-lg w-[300px] mm:w-[328px] md:w-[400px] shadow-all-sides border-[#66FCF1] border-2 h-[323px] justify-center items-center bg-[#2d2e34]'>
                            <img className='w-[110px] h-[99px]' src={raz} alt="" />
                            <h1 className='text-[20px] lg:text-[23px] text-white font-m'>Shaves & Haircuts</h1>
                            <p className='text-[16px] text-center body'>A complete grooming experience combining precise shaves and tailored haircuts.</p>
                        </div>
                        <div className='flex flex-col gap-3 rounded-lg w-[300px] mm:w-[328px] md:w-[400px] shadow-all-sides border-[#66FCF1] border-2 h-[323px] justify-center items-center bg-[#2d2e34]'>
                            <img className='w-[81px] h-[71px]' src={bread} alt="" />
                            <h1 className='text-[23px] text-white font-m'>Facial & Shave</h1>
                            <p className='text-[16px] text-center body'>Rejuvenate with refreshing facials and smooth, luxurious shaves.</p>
                        </div>
                    </div>
                    <div className='flex md:flex-row flex-col justify-between items-center gap-20 text-white px-11 lg:px-24 '>
                        <div className='flex flex-col gap-3 rounded-lg w-[300px] mm:w-[328px] md:w-[400px] shadow-all-sides border-[#66FCF1] border-2 h-[323px] justify-center items-center bg-[#2d2e34]'>
                            <img className='w-[55px] h-[75px]' src={face} alt="" />
                            <h1 className='text-[23px] text-white font-m'>Facial Treatments</h1>
                            <p className='text-[16px] text-center body'> Deep-cleansing facials <br /> for healthy, glowing skin.</p>
                        </div>
                        <div className='flex flex-col gap-3 rounded-lg w-[300px] mm:w-[328px] md:w-[400px] shadow-all-sides border-[#66FCF1] border-2 h-[323px] justify-center items-center bg-[#2d2e34]'>
                            <img className='w-[96px] h-[27px]' src={mush} alt="" />
                            <h1 className='text-[20px] lg:text-[23px] text-white font-m'>Mustache Trimming</h1>
                            <p className='text-[16px] text-center body'>Maintain a sharp and well <br />defined mustache with <br /> precision trimming.</p>
                        </div>
                        <div className='flex flex-col gap-3 rounded-lg w-[300px] mm:w-[328px] md:w-[400px] shadow-all-sides border-[#66FCF1] border-2 h-[323px] justify-center items-center bg-[#2d2e34]'>
                            <img className='w-[81px] h-[71px]' src={hair} alt="" />
                            <h1 className='text-[23px] text-white font-m'>Hair Styling</h1>
                            <p className='text-[16px] text-center body'>Styles crafted to enhance <br /> your unique personality.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[#141414] py-[40px] sm:py-[60px] px-[20px]'>
                <h2 className='text-white font-m text-center text-[25px] sm:text-[40px] leading-[35px] sm:leading-[45px] max-w-[800px] mx-auto'>
                    "Where scissors meet creativity, transformations
                    unfold in the mirror of the salon."
                </h2>
            </div>

            {/* <div className='bg-[#141414] py-20'>

                <div className='flex flex-col justify-center items-center'>
                    <img className='' src={mouth} alt="" />
                    <h1 className='text-[30px] md:text-[60px] font-m text-white'>Our Blog</h1>
                    <p className='text-[16px] md:text-[20px] body text-white'>Read Our  latest Blogs and News</p>
                </div>
                <div className='flex md:flex-row flex-col items-center justify-between gap-6 px-4 lg:px-10 xl:px-48 py-3 pt-10'>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px] rounded-lg' src={blog} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-start'>
                            <p className='text-[11px] body text-[#CCE9FC]'>20 July, 2023</p>
                            <h1 className='text-[24px] font-m text-white'>Online booking appoitment <br /> For Salon, Hair Salon</h1>
                            <a href="#" class="text-white hover:text-blue-700 underline decoration-[#66fcf1] font-medium">
                                Read More
                            </a>

                        </div>
                    </div>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px] rounded-lg' src={blog1} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-start'>
                            <p className='text-[11px] body text-[#CCE9FC]'>20 July, 2023</p>
                            <h1 className='text-[24px] font-m text-white'>Online booking appoitment <br /> For Salon, Hair Salon</h1>
                            <a href="#" class="text-white hover:text-blue-700 underline decoration-[#66fcf1] font-medium">
                                Read More
                            </a>

                        </div>
                    </div>
                    <div className='flex flex-col items-center bg-[#303030] rounded-lg shadow-bottom'>
                        <img className='w-[300px] h-[280px] rounded-lg' src={blog2} alt="" />
                        <div className='flex flex-col gap-4 py-3 items-start'>
                            <p className='text-[11px] body text-[#CCE9FC]'>20 July, 2023</p>
                            <h1 className='text-[24px] font-m text-white'>Online booking appoitment <br /> For Salon, Hair Salon</h1>
                            <a href="#" class="text-white hover:text-blue-700 underline decoration-[#66fcf1] font-medium">
                                Read More
                            </a>


                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center pt-20'>
                    <button className='text-[25px] relative body rounded-full slow border-cyan-400 text-white px-12 py-1 font-extrabold hover:bg-cyan-400 hover:text-black transition-all'>More Blog</button>
                    <img className='absolute right-[15rem] lg:right-[23rem] xl:right-[33.9rem]' src={elli} alt="" />
                    <img className='z-20 absolute right-[16rem] lg:right-[24rem] xl:right-[34.6rem]' src={arow} alt="" />
                </div>
            </div> */}
            {/* <div className='bg-[#232429] pt-20'>
                <div className='flex justify-between items-center px-4 md:px-24'>
                    <h1 className='text-[30px] md:text-[40px] lg:text-[60px] text-white font-m'>What people say about us</h1>
                    <div className='flex gap-4'>
                        <div className='flex relative' onClick={() => setIsVisible(!isVisible)}>
                            <img src={cir} alt="" />
                            <img className='w-[15px] md:w-[18px] h-[10px] md:h-[12px] -scale-x-110 absolute right-[0.5rem] md:right-[1rem] top-[0.6rem] md:top-[1rem]' src={arrw} alt=""

                            />
                        </div>
                        <div className='flex relative' onClick={() => setIsVisible(!isVisible)}>
                            <img src={cir} alt="" />
                            <img className='w-[15px] md:w-[20px] h-[10px] md:h-[12px] absolute right-[0.5rem] md:right-[0.7rem] top-[0.6rem] md:top-[1rem]' src={arrw} alt=""

                            />
                        </div>
                    </div>

                </div>
                <div className='flex md:flex-row flex-col justify-between items-center px-3 lg:pl-2 py-28 gap-8'>
                    <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg mm:w-[330px] lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
                        <div className='flex justify-between items-center px-8 py-3 xl:py-6'>
                            <div className='flex gap-4'>
                                <img className='w-[50px] h-[50px]' src={fyt} alt="" />
                                <div>
                                    <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Nick Presley</h1>
                                    <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>Adelle Tracy</p>
                                </div>
                            </div>
                            <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
                        </div>
                        <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>Top-notch service! The haircut and beard trim <br /> were perfect, and the attention to detail was <br /> incredible. I feel confident and sharp!</p>
                    </div>
                    <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg lg:w-[650px] md:w-[750px] h-[160px] md:h-[300px] lg:h-[250px]'>
                        <div className='flex justify-between items-center px-8 py-3 xl:py-6'>
                            <div className='flex gap-4'>
                                <img className='w-[50px] h-[50px]' src={ghy} alt="" />
                                <div>
                                    <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Blair Mitchell</h1>
                                    <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>One Year With Us </p>
                                </div>
                            </div>
                            <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
                        </div>
                        <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>The shave and haircut combo was fantastic. It was relaxing, and I left feeling completely refreshed. Highly recommend!</p>
                    </div>
                    <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
                        <div className='flex justify-between items-center px-4 xl:px-8 py-3 xl:py-6'>
                            <div className='flex gap-4'>
                                <img className='w-[50px] h-[50px]' src={yui} alt="" />
                                <div>
                                    <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Arlette Breedlove</h1>
                                    <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>One Year With Us </p>
                                </div>
                            </div>
                            <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
                        </div>
                        <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>I tried the facial and shave package, and it exceeded my expectations. My skin feels amazing, and the shave was incredibly smooth</p>
                    </div>
                    {isVisible && (


                        <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg mm:w-[330px] lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
                            <div className='flex justify-between items-center px-8 py-3 xl:py-6'>
                                <div className='flex gap-4'>
                                    <img className='w-[50px] h-[50px]' src={fyt} alt="" />
                                    <div>
                                        <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Nick Presley</h1>
                                        <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>Adelle Tracy</p>
                                    </div>
                                </div>
                                <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
                            </div>
                            <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>Top-notch service! The haircut and beard trim <br /> were perfect, and the attention to detail was <br /> incredible. I feel confident and sharp!</p>
                        </div>

                    )}
                </div>
            </div> */}
            <div className='flex md:flex-row flex-col'>
                <img src={f1} alt="" />
                <img src={f2} alt="" />
                <img src={f3} alt="" />
                <img src={f4} alt="" />
                <img src={f5} alt="" />
            </div>

        </>
    )
}

export default Expert
