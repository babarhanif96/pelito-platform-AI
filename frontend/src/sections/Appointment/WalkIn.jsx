import React, { useContext, useEffect, useState } from 'react'
import AddAppointmentModal from '../../components/ui/modals/AddAppontmentModal'
import SelectMemberModal from '../../components/ui/modals/Book/SelectMemberModal'
import SelectTimeModal from '../../components/ui/modals/Book/SelectTimeModal'
import StatesContext from '../../context/StatesContext'

const WalkIn = ({ open, setopen }) => {

    const context = useContext(StatesContext)
    const { state } = context

    const [selectedService, setselectedService] = useState('')
    const [name, setname] = useState('')
    const [phone, setphone] = useState('')

    const [openBook, setopenBook] = useState(false)
    const [selectedData, setselectedData] = useState({
        salonId: state.user._id,
    })
    const [openTime, setopenTime] = useState(false)


    useEffect(() => {
        if (selectedService) {
            setselectedData((prevData) => ({
                ...prevData,
                selectedService: { ...selectedService }
            }));
        }
    }, [selectedService]);
    



    return (
        <div>
            {open && (
                <AddAppointmentModal setopenBook={setopenBook} open={open} setOpen={setopen} name={name} setname={setname} phone={phone} setphone={setphone} selectedService={selectedService} setselectedService={setselectedService} />
            )}

            {openBook && (
                <SelectMemberModal open={openBook} setOpen={setopenBook} selectedData={selectedData} setselectedData={setselectedData} setopenTime={setopenTime} />
            )}

            {openTime && (
                <SelectTimeModal open={openTime} setOpen={setopenTime} selectedData={selectedData} isAppointment={true} />
            )}


        </div>
    )
}

export default WalkIn