import React from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'

import BasicSettings from '../../sections/ProfSettings/BasicSettings'




const CusSettings = () => {


    return (
        <div className=''>

            <Nav />

            <SideBar />
            <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
                <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]'>
                    <DashboardHeader title='Settings' />

                    <div className='mt-[30px] space-y-[15px]'>
                        <BasicSettings />
                      
                    </div>

                </div>


            </div>

        </div>
    )
}

export default CusSettings