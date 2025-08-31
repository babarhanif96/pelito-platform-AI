import React, { useContext } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'

import bg from '../../assets/dash.png'
import mypost from '../../assets/mypost.png'
import reported from '../../assets/reported.png'
import news from '../../assets/news.png'
import { useLocation, useNavigate } from 'react-router-dom'
import FeedPosts from '../../sections/NewsFeed/FeedPosts'
import Posts from '../../sections/NewsFeed/Posts'
import StatesContext from '../../context/StatesContext'


const Dashboard = () => {

  const context = useContext(StatesContext)
  const { state } = context

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isPost = pathname.includes('mypost') || pathname.includes('reported')

  return (
    <div className=''>

      <Nav />

      <SideBar />
      <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
        <div className='px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px]  pb-[40px] sm:pb-[20px]'>
          <DashboardHeader title={isPost ? `${state.user.user_type === 'admin' ? 'Reported Posts' : 'My Posts'}` : 'News Feed'} />

          <div className='grid grid-cols-1 sm:grid-cols-3 mt-[30px] gap-[25px] sm:gap-[30px]'>
            <div className='sm:col-span-2 relative'>
              <img src={bg} alt="" className='h-[180px] lg:h-[210px] w-full object-cover rounded-[10px]' />
              <div className='absolute top-[10%] left-[7%]'>
                <h2 className='text-white font-extrabold font-r text-[22px] sm:text-[25px] lg:text-[32px]'>
                  GOING PERFECT
                </h2>
                <p className='font-r pt-[10px] font-normal text-[12px] lg:text-[16px] leading-[20px] w-[200px] sm:w-[270px] lg:w-[352px] text-white'>
                  Welcome to your personalized Pelito Dashboard! Manage your appointments, track your services, and explore exclusive offers—all in one place.
                </p>
              </div>
            </div>

            <div className='w-full h-full px-[15px] py-[30px] rounded-[12px] flex flex-col justify-center items-center gap-[20px] bg-[#141414]'>
              <img src={news} alt="" className='h-[50px] sm:h-[35px] lg:h-[52px] cursor-pointer hover:scale-105 duration-500'
                onClick={() => {
                  if (state.user.user_type === "enthusiastic") {
                    navigate('/dashboard')
                  } else {
                    if (state.user.user_type === "admin") {
                      navigate('/admin/news-feed')
                    } else {
                      navigate('/professional/news-feed')
                    }
                  }
                }}
              />
              {state.user.user_type === "admin" ? (
                <img src={reported} alt="" className='h-[50px] sm:h-[35px] lg:h-[52px] cursor-pointer hover:scale-105 duration-500'
                  onClick={() => {
                    navigate('/admin/news-feed/reported')
                  }}
                />
              ) : (
                <img src={mypost} alt="" className='h-[50px] sm:h-[35px] lg:h-[52px] cursor-pointer hover:scale-105 duration-500'
                  onClick={() => {
                    if (state.user.user_type === "enthusiastic") {
                      navigate('/dashboard/mypost')
                    } else {
                      navigate('/professional/news-feed/mypost')
                    }
                  }}
                />
              )}

            </div>

          </div>

          <div className='mt-[25px] sm:mt-[30px]'>

            {!isPost && (
              <FeedPosts />
            )}

            <Posts />

          </div>

        </div>
      </div>

    </div>
  )
}

export default Dashboard