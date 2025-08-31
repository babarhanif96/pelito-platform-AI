// import React from 'react'
// import main from './assets/Group 1686552047.png'
// import uji from './assets/Frame 1686551909.png'
// import hyu from './assets/3 (1).png'
// import hgt from './assets/Vector (4).png'
// import hyg from './assets/Vector (3).png'
// import gfr from './assets/mage_goals-fill.png'
// import bnh from './assets/Mask group.png'

// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import SmartphoneIcon from '@mui/icons-material/Smartphone';
// import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
// import SchoolIcon from '@mui/icons-material/School';
// import WbSunnyIcon from '@mui/icons-material/WbSunny';
// import PublicIcon from '@mui/icons-material/Public';



// const Header2 = () => {
//     return (
//         <>
//             <div>
//                 <img className='md:w-full h-[180px] w-[1240px] md:h-[280px]' src={main} alt="" />

//                 <div className='bg-[#25262b] py-20 px-10'>
//                     <div className=' text-white'>
//                         <p className='text-[16px] md:text-[20px] body mb-6'>
//                             Pelito is the future of grooming—built for barbers, stylists, and the culture.
//                         </p>

//                         <p className='text-[16px] md:text-[20px] body mb-6'>
//                             We're not just another booking app or social platform. Pelito is an ecosystem built to help beauty professionals grow real wealth, gain control of their business, and connect with a community that moves with purpose.
//                         </p>

//                         <p className='text-[16px] md:text-[20px] body  mb-6'>
//                             We started Pelito after seeing too many barbers and stylists grinding hard without support—no retirement, no protection, no ownership. That ends here.
//                         </p>

//                         <h3 className='text-xl font-bold mb-4'>What We Do:</h3>
//                         <ul className='list-none space-y-3 text-[16px] md:text-[20px] body'>
//                             <li className='flex items-center gap-2'>
//                                 <AttachMoneyIcon className='text-green-400' />
//                                 Financial Tools: Retirement wallet, tax support, and AI-powered business reports.
//                             </li>
//                             <li className='flex items-center gap-2'>
//                                 <SmartphoneIcon className='text-blue-400' />
//                                 Tech That Works: Smart booking, product sales, and payment systems.
//                             </li>
//                             <li className='flex items-center gap-2'>
//                                 <CurrencyBitcoinIcon className='text-yellow-400' />
//                                 Crypto-Backed Growth: Powered by the Platinum Pelito Token (PLP) on Polygon.
//                             </li>
//                             <li className='flex items-center gap-2'>
//                                 <SchoolIcon className='text-orange-400' />
//                                 School Outreach: Programs teaching grooming, tech, cybersecurity, and AI.
//                             </li>
//                             <li className='flex items-center gap-2'>
//                                 <WbSunnyIcon className='text-purple-400' />
//                                 Culture + Community: A social hub for the grooming world.
//                             </li>
//                             <li className='flex items-center gap-2'>
//                                 <PublicIcon className='text-cyan-400' />
//                                 Real Ownership: You own your business, your data, and your future.
//                             </li>
//                         </ul>

//                         <h3 className='text-xl font-bold mt-8 mb-2'>Why Pelito?</h3>
//                         <p className='text-[16px] md:text-[20px] body'>
//                             Because it’s time barbers and stylists had more than a chair. They need tools, a platform, and a team. Pelito is where grooming meets legacy.
//                         </p>
//                     </div>
//                 </div>


//                 <div className='bg-black flex md:flex-row flex-col justify-between items-center px-4 xl:px-14 xl:py-20'>
//                     <div className='flex flex-col gap-8 '>
//                         <div>
//                             <h1 className='text-[30px] lg:text-[60px] text-white font-m'>Who we are</h1>
//                             <p className='text-[18px] text-white body'>Pelito is a team of expert barbers and stylists offering <br /> personalized grooming with creativity, precision, and <br /> care to help you look and feel your best.</p>
//                         </div>
//                         <div className='flex '>
//                             <img className='lg:w-[169px] w-[120px] h-[120px] lg:h-[169px]' src={uji} alt="" />
//                             <div>
//                                 <h1 className='text-[25px] lg:text-[30px] text-white font-m'>Years Experience Company</h1>
//                                 <p className='text-[14px] lg:text-[18px] text-white body'>With 5+ years of experience, Pelito offers <br /> expert grooming services, combining the <br /> latest trends and techniques to deliver high <br /> quality, personalized results.</p>
//                             </div>
//                         </div>
//                     </div>
//                     <img className='lg:w-[660px] w-[500px] h-[400px] lg:h-[451px]' src={hyu} alt="" />
//                 </div>
//                 <div className='bg-black flex md:flex-row flex-col justify-between items-center gap-8 px-10 py-20'>
//                     <div className='flex flex-col gap-4 bg-[#2d2e34] md:w-[385px] xl:w-[379px] h-[200px] xl:h-[180px] justify-start items-center px-4  rounded-lg pt-4 xl:pt-8'>
//                         <div className='flex justify-center gap-2'>
//                             <img src={gfr} alt="" />
//                             <h1 className='text-[20px] lg:text-[30px] font-m text-white'>Our Mission</h1>
//                         </div>
//                         <p className='text-[12px] lg:text-[14px] text-white body'>To provide exceptional grooming experiences <br /> that boost confidence and style through expert <br /> care and personalized service.</p>
//                     </div>
//                     <div className='flex flex-col gap-4 bg-[#2d2e34] md:w-[385px] xl:w-[379px] h-[200px] xl:h-[180px] rounded-lg justify-start items-center px-4 pt-4 xl:pt-8'>
//                         <div className='flex gap-2'>
//                             <img src={hyg} alt="" />
//                             <h1 className='text-[20px] lg:text-[30px] font-m text-white'>Our Vision</h1>
//                         </div>
//                         <p className='text-[12px] lg:text-[14px] text-white body'>To be a leading name in the grooming industry, <br /> known for innovation, quality, and customer <br /> satisfaction.</p>
//                     </div>
//                     <div className='flex flex-col gap-4 bg-[#2d2e34] md:w-[385px] xl:w-[379px] h-[200px] xl:h-[180px] rounded-lg justify-start items-center px-4 pt-4 xl:pt-8'>
//                         <div className='flex gap-2'>
//                             <img src={hgt} alt="" />
//                             <h1 className='text-[20px] lg:text-[30px] font-m text-white'>Trusted Services</h1>
//                         </div>
//                         <p className='text-[12px] lg:text-[14px] text-white body'>Delivering reliable, high-quality grooming <br /> services tailored to meet each individual's <br /> needs.</p>
//                     </div>
//                 </div>
//                 <div className='bg-[#1f1e20] flex md:flex-row flex-col justify-between gap-2 items-center py-4 px-4 xl:px-20 lg:py-20'>
//                     <img className='w-[450px] xl:w-[525px] md:h-[500px] lg:h-[600px] xl:h-[616px] rounded-lg' src={bnh} alt="" />
//                     <div className='text-white flex flex-col gap-4 lg:gap-10'>
//                         <div className=''>
//                             <h1 className='text-[25px] md:text-[40px] lg:text-[60px] font-m text-white'>Our Story</h1>
//                             <p className='text-[12px] md:text-[12px] lg:text-[15px] body'>Pelito was founded with a vision to revolutionize the grooming industry, blending artistry <br /> with innovation. Our journey began with the goal of creating a space where every client <br /> feels valued, relaxed, and empowered to embrace their unique style.</p>
//                         </div>
//                         <div>
//                             <h3 className='text-[30px] font-m text-white'>Tailored Experiences</h3>
//                             <p className='text-[12px] lg:text-[15px] body'>Our journey has been centered around the belief that grooming is deeply personal and <br /> should cater to each individual's unique style and preferences. From the beginning, Pelito <br /> has been committed to providing tailored services that not only meet the expectations of <br /> our clients but exceed them. We take the time to understand what makes each person <br /> unique, ensuring that every haircut, beard trim, or facial treatment is crafted to enhance <br /> their personal style and make them feel their best.</p>
//                         </div>
//                         <div>
//                             <h3 className='text-[30px] font-m text-white'>Trusted Reputation</h3>
//                             <p className='text-[12px] lg:text-[15px] body'>Clients trust Pelito not only for our technical expertise but also for our commitment to care <br /> and attention to detail. Every service we provide is carried out with precision, ensuring that <br /> each client leaves satisfied and looking their best. We understand the importance of <br /> grooming in boosting self-confidence, and our focus on delivering quality and individualized <br /> service has made us a go-to destination for many.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Header2



import React from 'react'
import main from './assets/Group 1686552047.png'
import uji from './assets/Frame 1686551909.png'
import hyu from './assets/3 (1).png'

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SchoolIcon from '@mui/icons-material/School';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import PublicIcon from '@mui/icons-material/Public';

const Header2 = () => {
    return (
        <>
            {/* Banner */}
            <img className='md:w-full h-[180px] w-[1240px] md:h-[280px]' src={main} alt="" />

            <div className='bg-[#25262b] py-20 px-10 text-white'>
                {/* About Pelito */}
                <h1 className='text-2xl md:text-3xl font-bold mb-6'>About Pelito</h1>
                <p className='text-[16px] md:text-[20px] body mb-6'>
                    Pelito is the future built for barbers, stylists, schools, and the next generation of professionals.
                </p>
                <p className='text-[16px] md:text-[20px] body mb-6'>
                    Pelito is a complete ecosystem that helps professionals and students:
                </p>
                <ul className='list-disc pl-6 space-y-2 text-[16px] md:text-[20px] body'>
                    <li>Earn real wealth.</li>
                    <li>Manage their business with confidence.</li>
                    <li>Build retirement and savings.</li>
                    <li>Connect with a community that moves with purpose.</li>
                </ul>

                {/* Why We Exist */}
                <h3 className='text-xl font-bold mt-10 mb-4'>Why We Exist</h3>
                <p className='text-[16px] md:text-[20px] body mb-6'>
                    Too many barbers and stylists work hard every day but are left with no retirement, no protection,
                    and no real ownership. That ends here.
                </p>
                <p className='text-[16px] md:text-[20px] body mb-6'>
                    Pelito was built to give professionals the same tools other industries take for granted:
                </p>
                <ul className='list-none space-y-3 text-[16px] md:text-[20px] body'>
                    <li className='flex items-center gap-2'>
                        <SmartphoneIcon className='text-blue-400' />
                        Booking + Payments → Seamless transactions with Stripe, crypto, and gift cards.
                    </li>
                    <li className='flex items-center gap-2'>
                        <AttachMoneyIcon className='text-green-400' />
                        AI Reports → Insights on revenue, repeat clients, busiest days, and performance.
                    </li>
                    <li className='flex items-center gap-2'>
                        <CurrencyBitcoinIcon className='text-yellow-400' />
                        Financial Tools → Pathways for savings, retirement, and future investments.
                    </li>
                    <li className='flex items-center gap-2'>
                        <PublicIcon className='text-cyan-400' />
                        Community → A platform that puts barbers, stylists, and students first.
                    </li>
                </ul>
            </div>

            {/* For Schools + Students */}
            <div className="bg-black flex md:flex-row flex-col justify-between items-center gap-10 px-4 xl:px-14 xl:py-20">
  {/* Left Content */}
  <div className="flex flex-col gap-6 max-w-2xl">
    <h1 className="text-[30px] lg:text-[60px] text-white font-m">
      For Schools + Students
    </h1>
    <p className="text-[16px] md:text-[18px] text-white body leading-relaxed">
      Pelito isn’t only for established shops — it’s a platform for education.
    </p>
    <ul className="list-disc pl-6 space-y-3 text-[15px] md:text-[18px] body text-white">
      <li>
        <span className="font-semibold">Career Training:</span> Students learn
        how to run a shop, not just cut hair.
      </li>
      <li>
        <span className="font-semibold">Business Skills:</span> Real-time
        booking, reporting, and client management built into the classroom.
      </li>
      <li>
        <span className="font-semibold">Financial Literacy:</span> Exposure to
        digital payments, AI analytics, and retirement planning early on.
      </li>
      <li>
        <span className="font-semibold">STEM Program:</span> Bringing grooming
        into schools as a launchpad for careers in fashion, tech, and
        entrepreneurship.
      </li>
    </ul>
  </div>

  {/* Right Image */}
  <img
    className="lg:w-[660px] w-[500px] h-[350px] lg:h-[451px] rounded-lg object-cover"
    src={hyu}
    alt="For Schools and Students"
  />
</div>

        </>
    )
}

export default Header2
