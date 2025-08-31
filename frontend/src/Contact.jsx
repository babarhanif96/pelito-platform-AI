import React from 'react'

import Chat from './Chat'
import Mininav from './Mininav'
import Nav from './Nav'
import Footer from './Footer'


const Contact = () => {
    return (
        <>
            <div className="overflow-hidden relative max-w-[1500px] mx-auto min-h-screen">
                <Mininav />
                <Nav />

                <Chat />

                <Footer />

            </div>
        </>
    )
}

export default Contact
