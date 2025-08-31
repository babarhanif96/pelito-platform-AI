import { useEffect, useState } from 'react';
import MobNav from './MobNav';


const Nav = () => {

    const [scrolled, setScrolled] = useState(false);


    useEffect(() => {

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <div className={`md:hidden fixed top-0 left-0 right-0 z-40 bg-[#141414] py-[15px] md:py-[10px]`}>

            <div className='max-w-[1300px] px-[20px] sm:px-[40px] mx-auto  '>
                <MobNav  />
            </div>
        </div>
    )
}

export default Nav