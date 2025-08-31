/* eslint-disable react/no-unescaped-entities */
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../../../../constant';
import StatesContext from '../../../../context/StatesContext';
import InputFeild from '../../InputFeild';
import { CircularProgress } from '@mui/material';
import axios from 'axios';




const AddProductModal = ({ open, setOpen, serviceData = '' }) => {

  const queryClient = useQueryClient();

  const context = useContext(StatesContext);
  const { state, handleStateChange } = context;

  const [profile_picture, setprofile_picture] = useState(serviceData?.img_url || '');
  const [loadingImg, setLoadingImg] = useState(false);

  const [serviceName, setServiceName] = useState(serviceData?.name || "");
  const [description, setDescription] = useState(serviceData?.description || "");
  const [price, setPrice] = useState(serviceData?.price || "");
  const [period, setPeriod] = useState(serviceData?.quantity || "");

  const [loading, setLoading] = useState(false);


  const inputRef = useRef();

  const handleImg = async () => {
    const files = inputRef.current.files;

    const token = localStorage.getItem('token');

    if (files.length > 0) {
      setLoadingImg(true);

      const formData1 = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData1.append("media", files[i]);
      }

      await axios
        .post(BACKEND_URL + "/upload/single-upload", formData1, {
          headers: { authorization: "Bearer " + token },
        })
        .then(function (response) {
          console.log(response.data.media)
          setprofile_picture(response.data.media);
          setLoadingImg(false);
        })
        .catch(function (error) {
          setLoadingImg(false);
          console.log(error);
        });
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();


    if (loadingImg || loading) return;

    if (!profile_picture) {
      handleStateChange({ error: 'Please upload a product picture' })
      return
    }

    const formData = {
      user_id: state.user._id,
      name: serviceName,
      description: description,
      price: price,
      quantity: period,
      img_url: profile_picture,
      seller_name: state.user.first_name
    };

  

    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      if (serviceData) {
        await axios
          .put(
            BACKEND_URL + "/product/" + serviceData._id,
            formData,
            { headers: { authorization: "Bearer " + token } }
          )
          .then(function (response) {
            setLoading(false);
            handleStateChange({ success: 'Product updated successfully' })
            setOpen(false)

            queryClient.invalidateQueries('product')

          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
          });
      } else {
        await axios
          .post(BACKEND_URL + "/product", formData, {
            headers: { authorization: "Bearer " + token },
          })
          .then(function (response) {
            setLoading(false);
            handleStateChange({ success: 'Product created successfully' })
            setOpen(false)

            queryClient.invalidateQueries('product')

          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
          });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
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
          className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[750px]"
        >
          <motion.div
            whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            initial='hidden'
            style={{ opacity: 0 }}
            viewport={{ once: true }}
          >
            <div className='relative w-[90%] sm:max-w-[700px] mx-auto'>
              <div className='absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]'>
                <h2 className='text-[#009688] text-center font-bold font-r text-[22px]'>
                  {serviceData ? 'Update' : 'Add'}  Product
                </h2>
                <div className='h-[28px] w-[28px] cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center'
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  <XMarkIcon className='h-[14px] text-white' />
                </div>
              </div>

              <div className=' w-full  rounded-[20px] relative '>

                <div className="bg-[#141414] relative z-10  rounded-[20px] px-[10px] lg:px-[10px] py-[30px] h-full">

                  <form onSubmit={(e) => handleSubmit(e)} className='mt-[50px] px-[10px] space-y-[15px] max-h-[400px] overflow-auto'>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>

                      <div>
                        <h2 className='text-white text-[14px] pb-[7px]'>
                          Name
                        </h2>
                        <InputFeild
                          isSetting={true}
                          placeholder={'Product Name'}
                          value={serviceName}
                          onChange={setServiceName}
                          required={true}

                        />
                      </div>
                      <div>
                        <h2 className='text-white text-[14px] pb-[7px]'>
                          Deatils
                        </h2>
                        <InputFeild
                          isSetting={true}
                          placeholder={'Product Details'}
                          value={description}
                          onChange={setDescription}
                          required={true}

                        />
                      </div>

                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-[15px]'>
                      <div>
                        <h2 className='text-white text-[14px] pb-[7px]'>
                          Price
                        </h2>
                        <InputFeild
                          isSetting={true}
                          placeholder={'$100'}
                          type={'number'}
                          value={price}
                          onChange={setPrice}
                          required={true}

                        />
                      </div>
                      <div>
                        <h2 className='text-white text-[14px] pb-[7px]'>
                          Quantity
                        </h2>
                        <InputFeild
                          isSetting={true}
                          placeholder={'5'}
                          value={period}
                          type={'number'}
                          onChange={setPeriod}
                          required={true}

                        />
                      </div>
                    </div>


                    <div className="">
                      <label
                        htmlFor="fileProduct"
                        className="text-[#009688] font-semibold opacity-80 cursor-pointer text-[14px]"
                      >
                        + Upload Product Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id="fileProduct"
                        ref={inputRef}
                        onChange={() => handleImg()}
                        className="hidden"
                      />
                    </div>

                    {loadingImg ? (

                      <div className='flex justify-center'>
                        <CircularProgress sx={{ color: 'white' }} size={25} />
                      </div>

                    ) : (
                      <>
                        {profile_picture && (
                          <img
                            src={profile_picture}
                            alt="user profile"
                            className="h-[80px] w-[80px] rounded-full object-cover mt-1"
                          />
                        )}
                      </>
                    )}

                    <div className='flex justify-end pt-[10px]'>
                      <button
                        type='submit'
                        disabled={loading}
                        className='bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[14px] w-[100px] sm:w-[120px] h-[32px] sm:h-[35px] rounded-[7px]'>
                        {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : ` ${serviceData ? 'Update' : 'Create'} Product`}
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

export default AddProductModal;
