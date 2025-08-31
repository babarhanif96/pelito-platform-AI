import React from 'react'
import hrf from './assets/Frame 5 (2).png'
import gty from './assets/Rectangle 934 (1).png'
import sci from './assets/icon scissors.png'
import raz from './assets/icon razor.png'
import bread from './assets/icon beard.png'
import face from './assets/icon facial.png'
import mush from './assets/icon mustache.png'
import hair from './assets/icon hair.png'
import star from './assets/Star 3.png'
import mouth from './assets/moustache 2.png'
import bnf from './assets/about-3 1 (2).png'
import bnh from './assets/beautiful-woman-has-cutting-hair-hairdresser (1).png'
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


const Header4 = () => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <>
            <div>
                <div className='relative flex justify-end'>
                    <img className='md:w-full md:h-[300px] h-[180px] w-full lg:h-[385px]' src={hrf} alt="" />
                    <div>
                        <img className='h-[385px] w-full absolute right-[1rem]' src={gty} alt="" />
                    </div>
                    <div className='absolute left-[1rem] md:left-[5rem] top-[3rem] md:top-[8em]'>
                        <h1 className='text-[30px] md:text-[70px] text-white font-m'>Luxe Styles Studio</h1>
                    </div>
                </div>
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
                <div className='bg-[#141414] md:flex-row flex-col flex justify-between px-4 md:px-0 md:pl-10 items-center'>
                    <div className='text-white'>
                        <h1 className='text-[30px] md:text-[40px] lg:text-[60px] text-white font-m'>Haircut & Beard Trim</h1>
                        <p className='text-[14px] lg:text-[17px] body'>At Pelito, we specialize in creating personalized looks with precision haircuts and expertly styled beard trims. Whether you prefer a modern, edgy cut or a classic style, our barbers craft each detail to suit your unique preferences.</p>
                        <p className='text-[14px] lg:text-[17px] body pt-8'>Our beard trims are tailored to complement your haircut, ensuring clean lines and sharp definition. With attention to every detail, we provide a grooming experience that leaves you looking polished, refreshed, and confident.</p>
                    </div>
                    <img className='md:w-[530px] md:h-[500px] lg:w-[688px] lg:h-[629px]' src={bnf} alt="" />
                </div>
                <div className='bg-[#1f1e20] flex md:flex-row flex-col px-4 justify-between items-center xl:px-20 lg:py-20'>
                    <img className='lg:w-[525px] w-[500px] h-[550px] lg:h-[616px] rounded-lg' src={bnh} alt="" />
                    <div className='text-white flex flex-col gap-4 lg:gap-10'>
                        <div className=''>
                            <h1 className='text-[30px] md:text-[40px] lg:text-[60px] font-m text-white'>Service Highlights</h1>
                            <p className='text-[15px] body'>At Pelito, we specialize in Precision Haircuts tailored to your unique face shape, hair texture, and personal style. Whether you prefer a modern, edgy cut or a classic look, our expert barbers work with you to create the perfect style.</p>
                        </div>
                        <div>
                            <h3 className='text-[30px] font-m text-white'>Custom Beard Styling</h3>
                            <p className='text-[15px] body'>A well-groomed beard can elevate your entire appearance. With our Custom Beard Styling, we focus on shaping and trimming your beard to perfectly complement your haircut, creating a balanced, cohesive look. Whether you’re after a sculpted beard with sharp, clean lines or a softer, blended style, our barbers provide expert attention to detail. We tailor the trim to your face structure and personal style, ensuring your beard enhances your overall look for a well-groomed finish that radiates confidence.</p>
                        </div>
                        <div>
                            <h3 className='text-[30px] font-m text-white'>Trend-Inspired Looks</h3>
                            <p className='text-[15px] body'>At Pelito, staying ahead of trends is at the heart of our services. We offer Trend-Inspired Looks that not only keep you fashionable but also enhance your natural features. Our barbers stay up-to-date with the latest trends in the grooming industry, ensuring that your style is always fresh and relevant. Whether you're looking for a modern twist on a classic cut or a bold, innovative style, we take your preferences into account and create a look that’s current, flattering, and designed to boost your self-confidence.</p>
                        </div>
                    </div>
                </div>
                <div className='bg-[#232429] pt-20'>
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
                    <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg mm:w-[328px] lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
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
                        

                            <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg mm:w-[328px] lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
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
            </div>
                <div className='flex md:flex-row flex-col'>
                    <img className='w-full md:w-[220px] h-[288px]' src={f1} alt="" />
                    <img src={f2} alt="" />
                    <img src={f3} alt="" />
                    <img src={f4} alt="" />
                    <img src={f5} alt="" />
                </div>
            </div>
        </>
    )
}

export default Header4
