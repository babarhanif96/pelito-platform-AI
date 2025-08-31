import { useContext, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import StatesContext from "./context/StatesContext"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import { useQuery } from '@tanstack/react-query'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from "./components/ui/Loader"
import { BACKEND_URL } from "./constant"
import Advisory from "./pages/Advisory"
import Cart from "./pages/Cart"
import CusSettings from "./pages/Customer/CusSettings"
import ProfAppointmentList from "./pages/Professional/Appointments/ProfAppointmentList"
import ProfAppointment from "./pages/Professional/Appointments/ProfAppointments"
import Dashboard from "./pages/Professional/Dashboard"
import ProfSettings from "./pages/Professional/ProfSettings"
import ProfWallet from "./pages/Professional/ProfWallet"
import Professionals from "./pages/Professionals"
import SalonDetail from "./pages/SalonDetail"
import StemProgram from "./pages/StemProgram"
import MyBookings from "./pages/User/MyBookings"
import MyProducts from "./pages/User/MyProducts"
import AuthRoute from "./routes/AuthRoute"
import ProfRoute from "./routes/ProfRoutes"
import UserRoute from "./routes/UserRoute"

import About from "./About"
import Contact from "./Contact"
import Home from "./Home"
import Shop from "./Shop"
import AdminTx from "./pages/admin/AdminTx"
import AdminUsers from "./pages/admin/AdminUsers"
import Forgot from "./pages/auth/Forgot"
import Reset from "./pages/auth/Reset"
import Verify from "./pages/auth/Verify"
import RootRoute from "./routes/RootRoute"
import AdminUserDetail from "./pages/admin/AdminUserDetail"
import Terms from "./pages/Terms"
import Airdrop from "./pages/Airdrop"
import GiftCard from "./pages/GiftCard"
import UserGuide from "./pages/Professional/UserGuide"
import BusinessAnalytics from "./pages/Professional/BusinessAnalytics"
import AIInsights from "./pages/Professional/AIInsights"
import TeamshopAnalysis from "./pages/Professional/TeamshopAnalysis"
import AdminTeamShopAnalysis from "./pages/admin/AdminTeamShopAnalysis"


const App = () => {

  const context = useContext(StatesContext)
  const { state, handleStateChange } = context

  const { pathname } = useLocation();


  const { data, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = localStorage.getItem('token');
      return fetch(`${BACKEND_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).then(async (res) => await res.json());
    },
  });


  useEffect(() => {

    if (state.error) {
      toast.error(state.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastClassName: "rounded-lg",
        className: 'text-[16px] mt-[75px] mx-auto md:mt-0 w-[320px] h-full rounded-md relative z-50',
        style: { borderRadius: '15px' },
      });
      handleStateChange({ error: '' })
    }

    if (state.success) {
      toast.success(state.success, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastClassName: "rounded-lg",
        className: 'text-[16px] mt-[75px] mx-auto md:mt-0 w-[320px] h-full rounded-md relative z-50',
        style: { borderRadius: '15px' },
      });
      handleStateChange({ success: '' })
    }

  }, [state.error, state.success])


  useEffect(() => {

    if (!isFetching && data && !data.success) {
      localStorage.removeItem('LoggedInTime')
      localStorage.removeItem('authUser')
      localStorage.removeItem('token')
      handleStateChange({ user: '' });
    }

    if (data && data.user) {
      handleStateChange({ user: data.user });
      localStorage.setItem('authUser', JSON.stringify(data.user));
    }

  }, [isFetching, data])

  useEffect(() => {

    window.scrollTo(0, 0);

  }, [pathname])


  return (
    <div>

      {state.loader && (
        <Loader title={state.loader} />
      )}

      <ToastContainer />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/:name" element={<SalonDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/professionals" element={<Professionals />} />

        <Route path="/terms/conditions" element={<Terms />} />

        <Route element={<AuthRoute />} >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
        </Route>

        <Route element={<ProfRoute />} >
          <Route path="/professional/news-feed" element={<Dashboard />} />
          <Route path="/professional/news-feed/mypost" element={<Dashboard />} />
          <Route path="/professional/stem-program" element={<StemProgram />} />
          <Route path="/professional/advisory" element={<Advisory />} />
          <Route path="/professional/settings" element={<ProfSettings />} />
          <Route path="/professional/appointments" element={<ProfAppointment />} />
          <Route path="/professional/appointments/list" element={<ProfAppointmentList />} />
          <Route path="/professional/wallet" element={<ProfWallet />} />
          <Route path="/professional/airdrop" element={<Airdrop />} />
          <Route path="/professional/gift-card" element={<GiftCard />} />
          <Route path="/professional/user-guide" element={<UserGuide />} />
          <Route path="/professional/analytics" element={<BusinessAnalytics />} />
          <Route path="/professional/ai-insights" element={<AIInsights />} />
        </Route>

        <Route element={<UserRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/mypost" element={<Dashboard />} />
          <Route path="/stem-program" element={<StemProgram />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/products" element={<MyProducts />} />
          <Route path="/settings" element={<CusSettings />} />
          <Route path="/airdrop" element={<Airdrop />} />
        </Route>

        <Route element={<RootRoute />} >
          <Route path="/admin/news-feed" element={<Dashboard />} />
          <Route path="/admin/news-feed/reported" element={<Dashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/tx" element={<AdminTx />} />
          <Route path="/admin/team-shop-analysis" element={<AdminTeamShopAnalysis />} />

        </Route>

      </Routes>
    </div>
  )
}

export default App