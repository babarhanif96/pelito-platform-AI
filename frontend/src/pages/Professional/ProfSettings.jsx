import React, { useContext } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'

import img1 from '../../assets/img1.png'
import img2 from '../../assets/img2.png'
import img3 from '../../assets/img3.png'
import img4 from '../../assets/img4.png'
import img5 from '../../assets/img5.png'
import img6 from '../../assets/img6.png'
import img7 from '../../assets/img7.png'
import img8 from '../../assets/img8.png'
import OnBoard from '../../sections/ProfSettings/OnBoard'
import StatesContext from '../../context/StatesContext'
import BasicSettings from '../../sections/ProfSettings/BasicSettings'
import ProfCover from '../../sections/ProfSettings/ProfCover'
import ProfContact from '../../sections/ProfSettings/Contact'
import OurWork from '../../sections/ProfSettings/OurWork'
import ProfServices from '../../sections/ProfSettings/ProfServices'
import ProfProduct from '../../sections/ProfSettings/ProfProduct'
import Members from '../../sections/ProfSettings/Members'
import DelAcc from '../../sections/ProfSettings/DelAcc'

const data = [
    {
        img: img1,
        title: 'PhET Simulations',
        desc: 'Learn by exploring, experimenting, and discovering in a game-like environment.'
    },
    {
        img: img2,
        title: 'NASA STEM Engagement',
        desc: "Reach for the stars with NASA's STEM resources."
    },
    {
        img: img3,
        title: 'Khan Academy',
        desc: 'Access free, world-class education for all grade levels.'
    },
    {
        img: img4,
        title: 'Code.org',
        desc: 'Empower yourself with the tools to code! Join fun tutorials.'
    },
    {
        img: img5,
        title: 'MIT OpenCourseWare',
        desc: 'Unlock cutting-edge knowledge from the Massachusetts Institute of Technology.'
    },
    {
        img: img6,
        title: 'CK-12 Foundation',
        desc: 'Access free, customizable resources to master STEM subjects.'
    },
    {
        img: img7,
        title: 'National Geographic',
        desc: 'Ignite curiosity and learn about the wonders of the world through exploration-focused programs.'
    },
    {
        img: img8,
        title: 'Exploratorium',
        desc: 'Explore science, art, and human perception in this one-of-a-kind learning lab.'
    },
]


const ProfSettings = () => {


    return (
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Settings' />

                    <div className='mt-[30px] space-y-[15px]'>
                        <OnBoard />
                        <BasicSettings />
                        <ProfCover />
                        <ProfContact />
                        <OurWork />
                        <ProfServices />
                        <ProfProduct />
                        <Members />
                        <DelAcc />
                    </div>

                </div>


            </div>

        </div>
    )
}

export default ProfSettings