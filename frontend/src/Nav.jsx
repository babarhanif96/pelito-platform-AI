import React, { useState, useEffect, useContext } from 'react';
import fgt from './assets/logo (17) 1.png';
import bgy from './assets/mdi_cart-outline (1).png';
import bnh from './assets/mdi_favourite-border.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { FORMAT_ADDRESS } from './utils';
import StatesContext from './context/StatesContext';
import CryptoBuyModal from './components/ui/modals/CryptoBuyModal';

const Nav = () => {

  const context = useContext(StatesContext)
  const { state, handleStateChange } = context

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { open: modalOpen } = useAppKit();
  const { address } = useAppKitAccount()
  const [open, setopen] = useState(false)

  useEffect(() => {
    // Prevent scrolling when menu is open
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  return (
    <>

      {open && (
        <CryptoBuyModal open={open} setOpen={setopen} />
      )}

      {/* Top Navigation Bar (always visible on large screens) */}
      <div className="flex justify-between items-center px-4 lg:px-10 xl:px-24 py-4 bg-black">
        {/* Logo */}
        <div>
          <img
            className="w-[40px] sm:w-[60px] lg:w-[100px] sm:h-[70px] lg:h-[100px]"
            src={fgt}
            alt="Logo"
          />
        </div>

        {/* Navigation Links (visible only on large screens) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-14 text-white text-[16px]">
          <Link to="/home">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/professionals">Professionals</Link>
          <Link to="/contact">Contact Us</Link>
          <p className='text-white  cursor-pointer'> <span onClick={() => {
            setopen(true)
          }}>Buy Pelito</span>  </p>

          {state.user ? (
            <p className='text-white  cursor-pointer'> <span onClick={() => {

              if (state.user.user_type === 'professional') {
                navigate('/professional/news-feed')
              } else {
                navigate('/dashboard')
              }

            }}>Dashboard</span>  </p>
          ) : (
            <>

              <p className='text-white cursor-pointer'
                onClick={() => navigate('/login')}
              > <span >Login</span>  /  <span >Register</span></p>

            </>
          )}

          <div className="flex gap-8">
            <img className="w-[20px] h-[20px] cursor-pointer" onClick={() => navigate('/cart')} src={bgy} alt="Cart" />
          </div>
          <button
            onClick={() => {
              modalOpen()
            }}
            className='text-[16px] rounded-full slow border-cyan-400 text-white px-3 lg:px-8 py-1 font-bold  bg-black hover:bg-cyan-400 hover:text-black transition-all'
          >
            {address ? FORMAT_ADDRESS(address, 4) : 'Connect wallet'}
          </button>
        </div>

        {/* Menu Button (visible only on small screens) */}
        <div className='flex items-center gap-[10px] md:hidden'>
          <button
            onClick={() => {
              modalOpen()
            }}
            className='text-[12px] md:hidden rounded-full slow border-cyan-400 text-white px-3  py-1 font-bold  bg-black transition-all'
          >
            {address ? FORMAT_ADDRESS(address, 4) : 'Connect'}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-auto md:hidden text-[#f5841f] body px-4 py-2 border border-[#00f0ff] rounded-md"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>


      </div>



      {/* Fullscreen Menu (visible only on small screens) */}
      <div
        className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden text-white absolute w-full z-50 bg-black inset-0 flex-col gap-6 lg:gap-10 xl:gap-20 items-center font-normal text-[14px] lg:text-[16px]`}
      >
        <div className="flex justify-between w-full items-center px-4 py-4 bg-black">
          {/* Logo */}
          <div>
            <img
              className="w-[60px] lg:w-[100px] h-[70px] lg:h-[100px]"
              src={fgt}
              alt="Logo"
            />
          </div>

          {/* Close Menu Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="ml-auto md:hidden text-[#f5841f] body px-4 py-2 border border-[#00f0ff] rounded-md"
          >
            Close Menu
          </button>
        </div>
        <div className="flex flex-col gap-10 text-[22px] items-center">
          <Link to="/home" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>

          {state.user ? (
            <p className='text-white  cursor-pointer'> <span onClick={() => {

              if (state.user.user_type === 'professional') {
                navigate('/professional/news-feed')
              } else {
                navigate('/dashboard')
              }
              setIsMenuOpen(false)

            }}>Dashboard</span>  </p>
          ) : (
            <>

              <p className='text-white cursor-pointer'
                onClick={() => {
                  setIsMenuOpen(false)
                  navigate('/login')
                }}
              > <span >Login</span>  /  <span >Register</span></p>

            </>
          )}

          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/professionals" onClick={() => setIsMenuOpen(false)}>
            Professionals
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </Link>
          <p className='text-white  cursor-pointer'> <span onClick={() => {
            setopen(true)
            setIsMenuOpen(false)
          }}>Buy Pelito</span>  </p>


          <div className="flex gap-2">
            <img className="w-[20px] h-[20px]" src={bgy} alt="Cart"
              onClick={() => navigate('/cart')}
            />
            {/* <img className="w-[24px] h-[24px]" src={bnh} alt="Favorites" /> */}
          </div>

        </div>
      </div>
    </>
  );
};

export default Nav;




