import React from 'react'
import main from './assets/Group 1686552047.png'
import hyu from './assets/3 (1).png'
import techImg from './assets/about-3 1 (1).png'
import aiIcon from './assets/01.png'
import blockchainIcon from './assets/02.png'
import giftIcon from './assets/03.png'
import scalableIcon from './assets/04.png'
import valueIcon from './assets/Ellipse 24.png'

// MUI Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import PublicIcon from '@mui/icons-material/Public';

const AboutUs = () => {
    return (
        <>
            {/* Banner */}
            <img className="md:w-full h-[180px] w-[1240px] md:h-[280px]" src={main} alt="About Pelito Banner" />

            {/* About Pelito */}
            <div className="bg-[#25262b] py-20 px-10 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">About Pelito</h1>
                <p className="text-[16px] md:text-[20px] body mb-6">
                    Pelito is the future built for barbers, stylists, schools, and the next generation of professionals.
                </p>
                <p className="text-[16px] md:text-[20px] body mb-6">
                    Pelito is a complete ecosystem that helps professionals and students:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] md:text-[20px] body">
                    <li>Earn real wealth.</li>
                    <li>Manage their business with confidence.</li>
                    <li>Build retirement and savings.</li>
                    <li>Connect with a community that moves with purpose.</li>
                </ul>

                {/* Why We Exist */}
                <h3 className="text-xl font-bold mt-10 mb-4">Why We Exist</h3>
                <p className="text-[16px] md:text-[20px] body mb-6">
                    Too many barbers and stylists work hard every day but are left with no retirement, no protection,
                    and no real ownership. That ends here.
                </p>
                <p className="text-[16px] md:text-[20px] body mb-6">
                    Pelito was built to give professionals the same tools other industries take for granted:
                </p>
                <ul className="list-none space-y-3 text-[16px] md:text-[20px] body">
                    <li className="flex items-center gap-2">
                        <SmartphoneIcon className="text-blue-400" />
                        Booking + Payments → Seamless transactions with Stripe, crypto, and gift cards.
                    </li>
                    <li className="flex items-center gap-2">
                        <AttachMoneyIcon className="text-green-400" />
                        AI Reports → Insights on revenue, repeat clients, busiest days, and performance.
                    </li>
                    <li className="flex items-center gap-2">
                        <CurrencyBitcoinIcon className="text-yellow-400" />
                        Financial Tools → Pathways for savings, retirement, and future investments.
                    </li>
                    <li className="flex items-center gap-2">
                        <PublicIcon className="text-cyan-400" />
                        Community → A platform that puts barbers, stylists, and students first.
                    </li>
                </ul>
            </div>

            {/* For Schools + Students */}
            {/* For Schools + Students */}
            <div className="bg-black flex md:flex-row flex-col justify-between items-center gap-10 px-4 xl:px-14 xl:py-20">
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
                <img
                    className="lg:w-[660px] w-[500px] h-[350px] lg:h-[451px] rounded-lg object-cover"
                    src={hyu}
                    alt="For Schools and Students"
                />
            </div>

            {/* Technology That Powers Pelito */}
            <div className="bg-[#1f1e20] text-white">
                <div className="flex md:flex-row flex-col items-center px-6 lg:px-14 py-16 gap-10">
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <h1 className="text-[30px] lg:text-[60px] font-m">Technology That Powers Pelito</h1>
                        <ul className="list-disc pl-6 space-y-4 text-[15px] md:text-[18px] leading-relaxed">
                            <li><strong>AI Reports:</strong> Track earnings, client retention, and trends.</li>
                            <li><strong>Blockchain Wallet:</strong> Secure, transparent payments + token rewards.</li>
                            <li><strong>Gift Cards + Airdrops:</strong> Easy ways to attract and retain clients.</li>
                            <li><strong>Scalable Platform:</strong> Works across desktops, tablets, and mobile.</li>
                        </ul>
                    </div>
                    <img src={techImg} alt="Technology" className="w-[600px] md:w-[500px] lg:w-[600px] rounded-lg" />
                </div>
            </div>

            {/* Mission */}
            <div className="px-6 lg:px-20 py-12 text-center text-white">
                <h2 className="text-[28px] md:text-[40px] font-m mb-4">Our Mission</h2>
                <p className="text-[16px] md:text-[20px] leading-relaxed max-w-3xl mx-auto ">
                    To provide every barber, stylist, and student with the tools to own their business, protect their
                    future, and build a legacy.
                </p>
            </div>

            {/* Vision */}
            <div className="px-6 lg:px-20 py-12 text-center bg-[#1f1e20] text-white">
                <h2 className="text-[28px] md:text-[40px] font-m mb-4">Our Vision</h2>
                <p className="text-[16px] md:text-[20px] leading-relaxed max-w-3xl mx-auto ">
                    To transform grooming into a career path with ownership, protection, and innovation at its core —
                    where classrooms become launchpads, and professionals thrive with data, AI, and financial security.
                </p>
            </div>

            {/* Values */}
            <div className="px-6 lg:px-20 py-16 bg-black text-white">
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
        </>
    )
}

export default AboutUs
