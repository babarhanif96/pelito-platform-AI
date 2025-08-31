import React from 'react'

import Header from './Header';

import Expert from "./Expert";

import Mininav from "./Mininav";
import Nav from './Nav';
import Footer from "./Footer";


const Home = () => {
    return (
        <>
            <div className="overflow-hidden relative max-w-[1500px] mx-auto min-h-screen">
                <Mininav />
                <Nav />

                <Header />
                <Expert />

                <Footer />

            </div>
        </>
    )
}

export default Home
