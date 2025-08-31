import { PencilSquareIcon } from '@heroicons/react/24/solid'
import React, { useContext, useState } from 'react'
import ProSettingsModal from '../../components/ui/modals/Professional/ProfSettingsModal'
import StatesContext from '../../context/StatesContext'
import ProfessorModal from '../../components/ui/modals/PasswordModal'
import CusSettingsModal from '../../components/ui/modals/CusSettingsModal'
import InviteUserModal from '../../components/ui/modals/InviteUserModal'

const BasicSettings = () => {

    const [open, setopen] = useState(false)
    const [cusSetting, setcusSetting] = useState(false)

    const [passOpen, setpassOpen] = useState(false)
    const [inviteOpen, setinviteOpen] = useState(false)

    const context = useContext(StatesContext)
    const { state } = context


    return (
        <div className='w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]'>

            {open && (
                <ProSettingsModal open={open} setOpen={setopen} />
            )}

            {cusSetting && (
                <CusSettingsModal open={cusSetting} setOpen={setcusSetting} />
            )}

            {passOpen && (
                <ProfessorModal open={passOpen} setOpen={setpassOpen} />
            )}

            {inviteOpen && (
                <InviteUserModal open={inviteOpen} setOpen={setinviteOpen} />
            )}

            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-white font-n font-bold text-[12px] sm:text-[16px]'>
                        {state.user.first_name} {state.user.last_name}
                    </h2>
                    <p className='text-white font-n font-normal text-[10px] sm:text-[13px]'>
                        {state.user.email}
                    </p>
                    <p
                        onClick={() => setpassOpen(true)}
                        className='text-[#009688] cursor-pointer font-n font-bold text-[10px] sm:text-[13px]'>
                        Change password
                    </p>

                    {state.user.user_type === "professional" && (
                        <p
                            onClick={() => setinviteOpen(true)}
                            className='text-[#009688] cursor-pointer underline underline-offset-4 font-n font-bold text-[10px] sm:text-[13px]'>
                            Invite Users
                        </p>
                    )}
                </div>
                <PencilSquareIcon className='text-white h-[17px] sm:h-[20px] cursor-pointer '
                    onClick={() => {
                        if (state.user.user_type === "enthusiastic") {
                            setcusSetting(true)
                        } else {
                            setopen(true)
                        }
                    }}
                />
            </div>


        </div>
    )
}

export default BasicSettings