import React from 'react'

import Header2 from "./Header2";
import Chose from "./Chose";

import Mininav from "./Mininav";
import Nav from './Nav';
import Footer from "./Footer";
import AboutUs from './AboutUs';



const About = () => {
    return (
        <>
            <div className="overflow-hidden relative max-w-[1500px] mx-auto min-h-screen">
                <Mininav />
                <Nav />
                <AboutUs/>
                {/* <Header2 />

                <Chose /> */}
                <Footer />

            </div>
        </>
    )
}

export default About
