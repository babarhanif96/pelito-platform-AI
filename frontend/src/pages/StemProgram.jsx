import React from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Nav from '../components/Nav'
import SideBar from '../components/Sidebar'

import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import img4 from '../assets/img4.png'
import img5 from '../assets/img5.png'
import img6 from '../assets/img6.png'
import img7 from '../assets/img7.png'
import img8 from '../assets/img8.png'

const data = [
    {
        img: img1,
        title: 'PhET Simulations',
        desc: 'Learn by exploring, experimenting, and discovering in a game-like environment.',
        link: 'https://phet.colorado.edu'
    },
    {
        img: img2,
        title: 'NASA STEM Engagement',
        desc: "Reach for the stars with NASA's STEM resources.",
        link: 'https://www.nasa.gov/learning-resources/'
    },
    {
        img: img3,
        title: 'Khan Academy',
        desc: 'Access free, world-class education for all grade levels.',
        link: 'https://www.khanacademy.org'
    },
    {
        img: img4,
        title: 'Code.org',
        desc: 'Empower yourself with the tools to code! Join fun tutorials.',
        link: 'https://code.org'
    },
    {
        img: img5,
        title: 'MIT OpenCourseWare',
        desc: 'Unlock cutting-edge knowledge from the Massachusetts Institute of Technology.',
        link: 'https://ocw.mit.edu/'
    },
    {
        img: img6,
        title: 'CK-12 Foundation',
        desc: 'Access free, customizable resources to master STEM subjects.',
        link: 'https://www.ck12.org/student/'
    },
    {
        img: img7,
        title: 'National Geographic',
        desc: 'Ignite curiosity and learn about the wonders of the world through exploration-focused programs.',
        link: 'https://www.nationalgeographic.org/society/education-resources/'
    },
    {
        img: img8,
        title: 'Exploratorium',
        desc: 'Explore science, art, and human perception in this one-of-a-kind learning lab.',
        link: 'https://www.exploratorium.edu/'
    },
]


const StemProgram = () => {




    return (
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Stem Program' />

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] mt-[40px] sm:mt-[60px]'>
                        {data.map((item, i) => (
                            <div key={i} className='bg-[#141414] md:hover:scale-105 duration-500 rounded-[12px] overflow-hidden cursor-pointer'
                                onClick={() => {
                                    window.open(item.link, '_blank')
                                }}
                            >
                                <img src={item.img} alt="" className='h-[153px] w-full object-cover' />
                                <div className='px-[15px] pt-[10px] pb-[15px]'>
                                    <h2 className='text-white font-r text-[14px] xl:text-[16px] font-bold'>
                                        {item.title}
                                    </h2>
                                    <p className='font-r text-[12px] leading-[16px] pt-[5px] font-light text-white'>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>


            </div>

        </div>
    )
}

export default StemProgram