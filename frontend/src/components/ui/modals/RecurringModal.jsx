/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import InputFeild from '../InputFeild';
import { useContext, useState } from 'react';
import { CircularProgress } from '@mui/material';
import StatesContext from '../../../context/StatesContext';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';
import valid from 'card-validator';

const RecurringModal = ({ open, setOpen, bookingId }) => {
    const context = useContext(StatesContext);
    const { state, handleStateChange } = context;

    const [formData, setFormData] = useState({
        recurring_type: "weekly",
        card_no: "",
        cv: "",
        exp_month: "01",
        exp_year: "2024",
    });

    const [loading, setLoading] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(50), (val, index) => currentYear + index);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate card details using card-validator package
    const validateCard = () => {
        const { card_no, cv, exp_month, exp_year } = formData;
        const numberValidation = valid.number(card_no);
        if (!numberValidation.isValid) {
            return "Invalid card details";
        }
        const cvvValidation = valid.cvv(cv);
        if (!cvvValidation.isValid) {
            return "Invalid card details";
        }
        const expValidation = valid.expirationDate({ month: exp_month, year: exp_year });
        if (!expValidation.isValid) {
            return "Invalid card details";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate card details before sending to backend
        const validationError = validateCard();
        if (validationError) {
            handleStateChange({ error: validationError });
            return;
        }

        const token = localStorage.getItem("token");

        let formDataNew = {};
        formDataNew["recurring_status"] = true;
        formDataNew["recurring_type"] = formData["recurring_type"];
        formDataNew["card_no"] = btoa(formData["card_no"]);
        formDataNew["cv"] = btoa(formData["cv"]);
        formDataNew["exp_month"] = btoa(formData["exp_month"]);
        formDataNew["exp_year"] = btoa(formData["exp_year"]);

        setLoading(true);
        try {
            await axios
                .put(
                    BACKEND_URL + "/service/update-recurring-status/" + bookingId,
                    formDataNew,
                    { headers: { authorization: "Bearer " + token } }
                )
                .then(function (response) {
                    handleStateChange({ success: 'Recurring added successfully' });
                    setOpen(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {open && (
                <div
                    className="fixed top-0 left-0 w-full h-full z-50"
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                    }}
                ></div>
            )}

            {open && (
                <div
                    className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[660px]"
                >
                    <motion.div
                        whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        initial='hidden'
                        style={{ opacity: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className='relative w-[90%] sm:max-w-[500px] mx-auto'>
                            <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                                <h2 className='text-[#009688] text-center font-bold font-r text-[18px] sm:text-[22px]'>
                                    Recurring Payment
                                </h2>
                                <div className='h-[28px] w-[28px] cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <XMarkIcon className='h-[14px] text-white' />
                                </div>
                            </div>

                            <div className='w-full rounded-[20px] relative'>
                                <div className="bg-[#141414] relative z-10 rounded-[20px] px-[10px] lg:px-[20px] py-[30px] h-full">
                                    <form
                                        onSubmit={handleSubmit}
                                        className='mt-[50px] px-[10px] space-y-[15px] max-h-[400px] overflow-auto'
                                    >
                                        <div>
                                            <h2 className='text-white text-[14px] pb-[7px]'>
                                                Recurring Type
                                            </h2>
                                            <select
                                                name="recurring_type"
                                                className="bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[38px] sm:h-[42px] px-[15px] rounded-[12px] max-h-[100px] overflow-y-auto"
                                                id="month"
                                                value={formData["recurring_type"]}
                                                onChange={handleChange}
                                            >
                                                <option value="weekly" className='bg-[#242424] text-white text-left'>Weekly</option>
                                                <option value="bi-weekly" className='bg-[#242424] text-white text-left'>Bi-weekly</option>
                                                <option value="monthly" className='bg-[#242424] text-white text-left'>Monthly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <h2 className='text-white text-[14px] pb-[7px]'>
                                                Card Number
                                            </h2>
                                            <input
                                                type="number"
                                                className='bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[38px] sm:h-[42px] px-[15px] rounded-[12px]'
                                                placeholder="Card No"
                                                name="card_no"
                                                value={formData.card_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <h2 className='text-white text-[14px] pb-[7px]'>
                                                CVV
                                            </h2>
                                            <input
                                                type="number"
                                                className='bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[38px] sm:h-[42px] px-[15px] rounded-[12px]'
                                                placeholder="CVV"
                                                name="cv"
                                                value={formData.cv}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <h2 className='text-white text-[14px] pb-[7px]'>
                                                Exp Month
                                            </h2>
                                            <select
                                                name="exp_month"
                                                className="bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[38px] sm:h-[42px] px-[15px] rounded-[12px] max-h-[100px] overflow-y-auto"
                                                id="month"
                                                value={formData["exp_month"]}
                                                onChange={handleChange}
                                            >
                                                <option value="01" className='bg-[#242424] text-white text-left'>January</option>
                                                <option value="02" className='bg-[#242424] text-white text-left'>February</option>
                                                <option value="03" className='bg-[#242424] text-white text-left'>March</option>
                                                <option value="04" className='bg-[#242424] text-white text-left'>April</option>
                                                <option value="05" className='bg-[#242424] text-white text-left'>May</option>
                                                <option value="06" className='bg-[#242424] text-white text-left'>June</option>
                                                <option value="07" className='bg-[#242424] text-white text-left'>July</option>
                                                <option value="08" className='bg-[#242424] text-white text-left'>August</option>
                                                <option value="09" className='bg-[#242424] text-white text-left'>September</option>
                                                <option value="10" className='bg-[#242424] text-white text-left'>October</option>
                                                <option value="11" className='bg-[#242424] text-white text-left'>November</option>
                                                <option value="12" className='bg-[#242424] text-white text-left'>December</option>
                                            </select>
                                        </div>
                                        <div>
                                            <h2 className='text-white text-[14px] pb-[7px]'>
                                                Exp Year
                                            </h2>
                                            <select
                                                className="bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] w-full h-[38px] sm:h-[42px] px-[15px] rounded-[12px] max-h-[100px] overflow-y-auto"
                                                name="exp_year"
                                                id="year"
                                                value={formData["exp_year"]}
                                                onChange={handleChange}
                                            >
                                                {years.map((year, index) => (
                                                    <option key={index} value={year} className='bg-[#242424] text-white text-left'>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='flex justify-end py-[10px]'>
                                            <button
                                                type='submit'
                                                disabled={loading}
                                                className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px] h-[32px] rounded-[7px]'
                                            >
                                                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : 'Submit'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className='absolute inset-[-2px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[20px]' />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default RecurringModal;
