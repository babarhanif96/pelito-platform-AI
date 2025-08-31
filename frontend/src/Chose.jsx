// import React from 'react'
// import hgt from './assets/Ellipse 25 (1).png'
// import hyg from './assets/Ellipse 24 (1).png'
// import gfr from './assets/Ellipse 25.png'
// import mouth from './assets/moustache 2.png'
// import tuik from './assets/mdi_tick.png'
// import jik from './assets/about-3 1 (1).png'
// import star from './assets/Star 3.png'
// import item from './assets/Ellipse 24.png'
// import arrw from './assets/Group 1000015007.png'
// import fyt from './assets/634.png'
// import bhn from './assets/Path 173.png'
// import yui from './assets/12628.png'
// import ghy from './assets/14940.png'
// import f1 from './assets/01.png'
// import f2 from './assets/02.png'
// import f3 from './assets/03.png'
// import f4 from './assets/04.png'
// import f5 from './assets/05.png'
// import cir from './assets/Ellipse 10331.png'
// import { useState } from 'react';

// const Chose = () => {
//      const [isVisible, setIsVisible] = useState(false);
//     return (
//         <>
//             <div className='bg-black py-10'>
//                 <div className='flex flex-col justify-center items-center'>
//                     <img className='' src={mouth} alt="" />
//                     <h1 className='text-[30px] md:text-[60px] font-m text-white'>Why Choose Us?</h1>
//                     <p className='text-[14px] md:text-[20px] body text-white'>Choose Pelito for expert, personalized grooming</p>
//                 </div>
//                 <div className=' flex md:flex-row flex-col justify-between items-center gap-4 mm:px-4 xl:gap-8 xl:px-10 py-20'>
//                     <div className='flex flex-col bg-[#2d2e34] md:w-[380px] xl:w-[379px] h-[200px] xl:h-[180px] rounded-lg '>
//                         <div className='flex'>
//                             <img className='w-[100px] h-[100px]' src={gfr} alt="" />
//                             <h1 className='text-[20px] lg:text-[30px] font-m pt-6 text-white'>Expert Team</h1>
//                         </div>
//                         <p className='text-[12px] lg:text-[14px] text-white pl-8 body'>Our barbers and stylists bring years of <br /> experience and a deep understanding of <br /> modern grooming trends.</p>
//                     </div>
//                     <div className='flex flex-col bg-[#2d2e34] md:w-[380px] xl:w-[379px] h-[200px] xl:h-[180px] rounded-lg'>
//                         <div className='flex gap-2'>
//                             <img className='w-[100px] h-[100px]' src={hyg} alt="" />
//                             <h1 className='text-[18px] md:text-[20px] lg:text-[25px] xl:text-[30px] font-m pt-6 text-white'>Personalized Care</h1>
//                         </div>
//                         <p className='text-[12px] lg:text-[14px] text-white pl-4 xl:pl-8 body'>We take the time to understand your <br /> preferences, offering tailored solutions that <br /> match your style and personality.</p>
//                     </div>
//                     <div className='flex flex-col bg-[#2d2e34] md:w-[380px] xl:w-[379px] h-[200px] xl:h-[180px] rounded-lg '>
//                         <div className='flex gap-2'>
//                             <img className='w-[100px] h-[100px]' src={hgt} alt="" />
//                             <h1 className='text-[18px] md:text-[20px] lg:text-[25px] xl:text-[30px] font-m pt-6 text-white'>Premium Products</h1>
//                         </div>
//                         <p className='text-[12px] lg:text-[14px] text-white pl-4 xl:pl-8 body'>We are committed to providing the best care <br /> with products that deliver lasting results and <br /> cater to your individual grooming needs.</p>
//                     </div>
//                 </div>
//             </div>
//             <div>
//                 <div className='flex md:flex-row flex-col items-center px-4 md:px-0 bg-[#1f1e20] gap-10 justify-between md:pl-4 lg:pl-14'>
//                     <div className='text-white flex flex-col gap-10'>
//                         <h1 className='text-[30px] lg:text-[60px] font-m pt-16 text-white'>What we Offer</h1>
//                         <p className='text-[15px] body'>We pride ourselves on offering a comprehensive range of grooming solutions <br /> tailored to men who appreciate quality, precision, and style. Every service is <br /> designed to help you look and feel your best, while reflecting your unique <br /> personality and preferences.</p>
//                         <div className='flex gap-10 lg:gap-6'>
//                             <div className='flex flex-col gap-6 xl:gap-10'>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Haircuts & Styling</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Shaves & Facials</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Mustache Trimming</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Beard Coloring</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Scalp Treatments</p>
//                                 </div>
//                             </div>
//                             <div className='flex flex-col gap-6 xl:gap-10'>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Hair  Blow-Dry</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Hair Spa Treatments</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Hair Loss Solutions</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Eyebrow Grooming</p>
//                                 </div>
//                                 <div className="flex">
//                                     <img src={tuik} alt="" />
//                                     <p className='text-[14px] lg:text-[17px] xl:text-[20px] body'>Hair Straightening</p>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                     <img className='w-[600px]  xl:w-[688px] md:h-[787px]' src={jik} alt="" />
//                 </div>
//             </div>
//             <div className='bg-[#141414]'>
//                 <div className=' pt-20 px-4'>
//                     <img className='pl-20' src={star} alt="" />
//                     <div className='flex flex-col justify-center items-center'>
//                         <img className='' src={mouth} alt="" />
//                         <h1 className='text-[30px] md:text-[60px] font-m text-white'>Our Values</h1>
//                         <p className='text-[16px] md:text-[20px] body text-white'>Commitment to quality, innovation, care, and trust.</p>
//                     </div>
//                 </div>
//                 <div className='flex md:flex-row flex-col justify-center px-4 gap-2 lg:gap-8 py-10 md:py-20'>
//                     <div className='flex flex-col gap-4'>
//                         <div className='flex flex-col bg-[#2d2e34] md:w-[379px] md:h-[180px] rounded-lg '>
//                             <div className='flex gap-2'>
//                                 <img className='w-[100px] h-[100px]' src={item} alt="" />
//                                 <h1 className='text-[30px] font-m pt-6 text-white'>Expert Team</h1>
//                             </div>
//                             <p className='text-[11px] text-white pl-8 body'>At Pelito, we are dedicated to delivering the highest <br /> level of grooming services. Every haircut, shave, and <br /> treatment is executed with precision and care, ensuring <br /> that our clients receive the best results every time.</p>
//                         </div>
//                         <div className='flex flex-col bg-[#2d2e34] md:-[379px] md:h-[180px] rounded-lg '>
//                             <div className='flex gap-2'>
//                                 <img className='w-[100px] h-[100px]' src={item} alt="" />
//                                 <h1 className='text-[30px] font-m pt-6 text-white'>Innovation</h1>
//                             </div>
//                             <p className='text-[11px] text-white pl-8 body'>We believe in staying ahead of the curve. By <br /> continuously exploring new trends, techniques, and <br /> technologies, we bring fresh and innovative ideas to <br /> our clients.</p>
//                         </div>
//                     </div>
//                     <div className='flex flex-col gap-4'>
//                         <div className='flex flex-col bg-[#2d2e34] md:w-[379px] md:h-[180px] rounded-lg '>
//                             <div className='flex gap-2'>
//                                 <img className='w-[100px] h-[100px]' src={item} alt="" />
//                                 <h1 className='text-[30px] font-m pt-6 text-white'>Care</h1>
//                             </div>
//                             <p className='text-[11px] text-white pl-8 body'>We understand that grooming is a personal experience. <br /> At Pelito, we make it a priority to treat every client with <br /> care and respect, ensuring a comfortable and <br /> enjoyable visit.</p>
//                         </div>
//                         <div className='flex flex-col bg-[#2d2e34] md:w-[379px] md:h-[180px] rounded-lg '>
//                             <div className='flex gap-2'>
//                                 <img className='w-[100px] h-[100px]' src={item} alt="" />
//                                 <h1 className='text-[30px] font-m pt-6 text-white'>Integrity</h1>
//                             </div>
//                             <p className='text-[11px] text-white pl-8 body'>Honesty and transparency are fundamental to how we  <br />operate. We maintain clear communication with our <br /> clients about services, pricing, and expectations, <br /> ensuring trust and confidence in every interaction.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='bg-[#232429] pt-20'>
//                 <div className='flex justify-between items-center px-4 md:px-24'>
//                     <h1 className='text-[30px] md:text-[40px] lg:text-[60px] text-white font-m'>What people say about us</h1>
//                     <div className='flex gap-4'>
//                         <div className='flex relative' onClick={() => setIsVisible(!isVisible)}>
//                             <img src={cir} alt="" />
//                             <img className='w-[15px] md:w-[18px] h-[10px] md:h-[12px] -scale-x-110 absolute right-[0.5rem] md:right-[1rem] top-[0.6rem] md:top-[1rem]' src={arrw} alt=""
                                
//                             />
//                         </div>
//                         <div className='flex relative' onClick={() => setIsVisible(!isVisible)}>
//                             <img src={cir} alt="" />
//                             <img className='w-[15px] md:w-[20px] h-[10px] md:h-[12px] absolute right-[0.5rem] md:right-[0.7rem] top-[0.6rem] md:top-[1rem]' src={arrw} alt=""
                                
//                             />
//                         </div>
//                     </div>

//                 </div>
//                 <div className='flex md:flex-row flex-col justify-between items-center px-3 lg:pl-2 py-28 gap-8'>
//                     <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg mm:w-[328px] lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
//                         <div className='flex justify-between items-center px-8 py-3 xl:py-6'>
//                             <div className='flex gap-4'>
//                                 <img className='w-[50px] h-[50px]' src={fyt} alt="" />
//                                 <div>
//                                     <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Nick Presley</h1>
//                                     <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>Adelle Tracy</p>
//                                 </div>
//                             </div>
//                             <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
//                         </div>
//                         <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>Top-notch service! The haircut and beard trim <br /> were perfect, and the attention to detail was <br /> incredible. I feel confident and sharp!</p>
//                     </div>
//                     <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg lg:w-[650px] md:w-[750px] h-[160px] md:h-[300px] lg:h-[250px]'>
//                         <div className='flex justify-between items-center px-8 py-3 xl:py-6'>
//                             <div className='flex gap-4'>
//                                 <img className='w-[50px] h-[50px]' src={ghy} alt="" />
//                                 <div>
//                                     <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Blair Mitchell</h1>
//                                     <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>One Year With Us </p>
//                                 </div>
//                             </div>
//                             <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
//                         </div>
//                         <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>The shave and haircut combo was fantastic. It was relaxing, and I left feeling completely refreshed. Highly recommend!</p>
//                     </div>
//                     <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
//                         <div className='flex justify-between items-center px-4 xl:px-8 py-3 xl:py-6'>
//                             <div className='flex gap-4'>
//                                 <img className='w-[50px] h-[50px]' src={yui} alt="" />
//                                 <div>
//                                     <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Arlette Breedlove</h1>
//                                     <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>One Year With Us </p>
//                                 </div>
//                             </div>
//                             <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
//                         </div>
//                         <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>I tried the facial and shave package, and it exceeded my expectations. My skin feels amazing, and the shave was incredibly smooth</p>
//                     </div>
//                     {isVisible && (
                        

//                             <div className='flex flex-col gap-2 bg-[#2d2e34] shadow-bottom-custom rounded-lg mm:w-[328px] lg:w-[650px] h-[160px] md:w-[750px] md:h-[300px] lg:h-[250px]'>
//                                 <div className='flex justify-between items-center px-8 py-3 xl:py-6'>
//                                     <div className='flex gap-4'>
//                                         <img className='w-[50px] h-[50px]' src={fyt} alt="" />
//                                         <div>
//                                             <h1 className='text-[20px] xl:text-[25px] text-white font-m'>Nick Presley</h1>
//                                             <p className='text-[14px] xl:text-[16px] text-[#CCE9FC] body'>Adelle Tracy</p>
//                                         </div>
//                                     </div>
//                                     <img className='w-[30px] xl:w-[40px] h-[20px] xl:h-[30px]' src={bhn} alt="" />
//                                 </div>
//                                 <p className='text-[13px] xl:text-[16px] body text-[#CCE9FC] pl-8'>Top-notch service! The haircut and beard trim <br /> were perfect, and the attention to detail was <br /> incredible. I feel confident and sharp!</p>
//                             </div>
                        
//                     )}
//                 </div>
//             </div>
//             <div className='flex md:flex-row flex-col'>
//             <img className='w-full md:w-[220px] h-[288px]' src={f1} alt="" />
//                 <img src={f2} alt="" />
//                 <img src={f3} alt="" />
//                 <img src={f4} alt="" />
//                 <img src={f5} alt="" />
//             </div>
//         </>
//     )
// }

// export default Chose;



import React from 'react'
import techImg from './assets/about-3 1 (1).png'
import aiIcon from './assets/01.png'
import blockchainIcon from './assets/02.png'
import giftIcon from './assets/03.png'
import scalableIcon from './assets/04.png'
import valueIcon from './assets/Ellipse 24.png'

const Chose = () => {
    return (
        <div className="bg-black text-white">
            {/* Technology That Powers Pelito */}
            <div className="flex md:flex-row flex-col items-center px-6 lg:px-14 py-16 gap-10">
                <div className="flex flex-col gap-6 max-w-2xl">
                    <h1 className="text-[30px] lg:text-[60px] font-m">Technology That Powers Pelito</h1>
                    <ul className="space-y-4 text-[15px] md:text-[18px] leading-relaxed">
                        <li className="flex items-start gap-3">
                            <img src={aiIcon} alt="AI Reports" className="w-[40px] h-[40px]" />
                            <span><strong>AI Reports:</strong> Track earnings, client retention, and trends.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src={blockchainIcon} alt="Blockchain" className="w-[40px] h-[40px]" />
                            <span><strong>Blockchain Wallet:</strong> Secure, transparent payments + token rewards.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src={giftIcon} alt="Gift Cards" className="w-[40px] h-[40px]" />
                            <span><strong>Gift Cards + Airdrops:</strong> Easy ways to attract and retain clients.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src={scalableIcon} alt="Scalable" className="w-[40px] h-[40px]" />
                            <span><strong>Scalable Platform:</strong> Works across desktops, tablets, and mobile.</span>
                        </li>
                    </ul>
                </div>
                <img src={techImg} alt="Technology" className="w-[600px] md:w-[500px] lg:w-[600px] rounded-lg" />
            </div>

            {/* Our Mission */}
            <div className="px-6 lg:px-20 py-12 text-center">
                <h2 className="text-[28px] md:text-[40px] font-m mb-4">Our Mission</h2>
                <p className="text-[16px] md:text-[20px] leading-relaxed max-w-3xl mx-auto">
                    To provide every barber, stylist, and student with the tools to own their business, protect their
                    future, and build a legacy.
                </p>
            </div>

            {/* Our Vision */}
            <div className="px-6 lg:px-20 py-12 text-center bg-[#1f1e20]">
                <h2 className="text-[28px] md:text-[40px] font-m mb-4">Our Vision</h2>
                <p className="text-[16px] md:text-[20px] leading-relaxed max-w-3xl mx-auto">
                    To transform grooming into a career path with ownership, protection, and innovation at its core —
                    where classrooms become launchpads, and professionals thrive with data, AI, and financial security.
                </p>
            </div>

            {/* Our Values */}
            <div className="px-6 lg:px-20 py-16">
                <h2 className="text-[28px] md:text-[40px] font-m text-center mb-8">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="flex items-start gap-4 bg-[#2d2e34] p-6 rounded-lg">
                        <img src={valueIcon} alt="Innovation" className="w-[60px] h-[60px]" />
                        <div>
                            <h3 className="text-[22px] font-m">Innovation</h3>
                            <p className="text-[14px] md:text-[16px]">Always staying ahead with tech that works for barbers.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 bg-[#2d2e34] p-6 rounded-lg">
                        <img src={valueIcon} alt="Integrity" className="w-[60px] h-[60px]" />
                        <div>
                            <h3 className="text-[22px] font-m">Integrity</h3>
                            <p className="text-[14px] md:text-[16px]">Honest tools, transparent results, and trusted partnerships.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 bg-[#2d2e34] p-6 rounded-lg">
                        <img src={valueIcon} alt="Community" className="w-[60px] h-[60px]" />
                        <div>
                            <h3 className="text-[22px] font-m">Community</h3>
                            <p className="text-[14px] md:text-[16px]">Built with and for the barber culture.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 bg-[#2d2e34] p-6 rounded-lg">
                        <img src={valueIcon} alt="Legacy" className="w-[60px] h-[60px]" />
                        <div>
                            <h3 className="text-[22px] font-m">Legacy</h3>
                            <p className="text-[14px] md:text-[16px]">Preparing the next generation to achieve more than just a chair.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chose
