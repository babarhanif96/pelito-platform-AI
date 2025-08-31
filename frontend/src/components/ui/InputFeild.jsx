import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const InputFeild = ({ placeholder, password, type, value, onChange, required, isContact = false, isSetting = false }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const inputType = password ? (isPasswordVisible ? 'text' : 'password') : type;

    const handleKeyDown = (e) => {
        if (type === "number" && (e.key === "-" || e.key === "e" || e.key === "E")) {
            e.preventDefault();
        }
    };

    const handleInputChange = (e) => {
        let newValue = e.target.value;

        // Restrict to 300 characters only if the placeholder matches
        if (placeholder === 'Try to do not exceed 300 character' && newValue.length > 300) return;

        // Ensure only digits for number input
        if (type === "number") {
            newValue = newValue.replace(/[^0-9]/g, "");
        }

        onChange(newValue);
    };

    return (
        <div className={`${password && 'flex justify-center items-center'} overflow-hidden 
            ${isContact ? 'bg-[#141414] rounded-[7px]' : ` ${isSetting ? 'bg-[rgba(225,225,225,0.08)]' : 'bg-[#3D404B]'} rounded-[12px]`} w-full`}>

            <input
                placeholder={placeholder}
                type={inputType || 'text'}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                required={required}
                className={`outline-none w-full text-[13px] bg-transparent text-white font-normal h-[38px] 
                    ${isContact ? 'sm:h-[52px] px-[20px] sm:px-[25px]' : 'sm:h-[42px] px-[15px]'} `}
            />

            {password && (
                <div className="pr-[15px] cursor-pointer h-full mb-[5px]">
                    <div className='cursor-pointer' onClick={togglePasswordVisibility}>
                        {isPasswordVisible ? (
                            <VisibilityOffIcon sx={{ fontSize: '22px', color: 'white' }} />
                        ) : (
                            <VisibilityIcon sx={{ fontSize: '22px', color: 'white' }} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputFeild;
