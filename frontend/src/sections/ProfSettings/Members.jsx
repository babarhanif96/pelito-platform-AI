import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { BACKEND_URL } from "../../constant";
import StatesContext from "../../context/StatesContext";
import MemberModal from "../../components/ui/modals/Professional/MemberModal";
import MemberShiftModal from "../../components/ui/modals/Professional/MemberShiftModal";
import MemberDatesModal from "../../components/ui/modals/Professional/MemberDatesModal";
import CalendarModal from "../../components/ui/modals/Professional/CalendarModal";
//import Model from "./model";
import ScheduleShift from "./ScheduleShift";
import { motion } from "framer-motion";

const Members = () => {
  const queryClient = useQueryClient();

  const context = useContext(StatesContext);
  const { state, handleStateChange } = context;

  const [open, setopen] = useState(false);
  const [serviceData, setserviceData] = useState("");
  const [memberId, setmemberId] = useState("");
  const [openMemberDates, setopenmemberDates] = useState(false);
  const [openCalendar, setopenCalendar] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [memberDataModal, setMemberDataModal] = useState();

  const [openShift, setopenShift] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["member"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      return fetch(`${BACKEND_URL}/member/get-all-member/${state.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => await res.json());
    },
  });

  const handleDelete = async (deleteId) => {
    const token = localStorage.getItem("token");

    handleStateChange({ loader: "Deleting" });

    try {
      await axios
        .delete(BACKEND_URL + "/member/" + deleteId, {
          headers: { authorization: "Bearer " + token },
        })
        .then(function (response) {
          handleStateChange({ success: "Member deleted successfully" });
          queryClient.invalidateQueries("member");
        });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      handleStateChange({ loader: "" });
    }
  };

  const openModalSchedule = (member) => {
    setMemberDataModal(member.item);
    setOpenSchedule(true);
  };

  const closeModalSchedule = () => {
    setOpenSchedule(false);
  };

  return (
    <div className="w-full bg-[#141414] rounded-[12px] px-[20px] py-[20px]">
      {open && (
        <MemberModal open={open} setOpen={setopen} serviceData={serviceData} />
      )}

      {openMemberDates && (
        <MemberDatesModal
          open={openMemberDates}
          setOpen={setopenmemberDates}
          serviceData={serviceData}
          setopenCalendar={setopenCalendar}
        />
      )}

      {openCalendar && (
        <CalendarModal
          open={openCalendar}
          setOpen={setopenCalendar}
          serviceData={serviceData}
        />
      )}

      {openShift && (
        <MemberShiftModal
          open={openShift}
          setOpen={setopenShift}
          memberId={memberId}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white font-n font-bold text-[12px] sm:text-[16px]">
            Members
          </h2>
        </div>

        <div className="">
          <PlusIcon
            className="text-white h-[17px] sm:h-[20px] cursor-pointer "
            onClick={() => {
              setopen(true);
              setserviceData("");
            }}
          />
        </div>
      </div>

      <div className="mt-[20px]">
        {!isLoading && (
          <div>
            {data && data.length > 0 ? (
              <div className="space-y-[20px]">
                {data.map((data, i) => {
                  return (
                    <div className="flex justify-between items-center" key={i}>
                      <div className="flex items-center gap-[10px]">
                        <img
                          alt="workImg"
                          src={data.item.profile_picture}
                          className={`h-[50px]  w-[50px]  object-cover rounded-full`}
                        />
                        <div>
                          <h2 className="text-white text-[16px] font-r font-semibold">
                            {data.item.first_name} {data.item.last_name}
                          </h2>
                          <h2 className="text-white text-[13px] font-r font-semibold">
                            <span className="text-[#009688]">
                              {" "}
                              {data.item.job_title}
                            </span>
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-[7px] items-center">
                        <button
                          onClick={() => {
                            setopenmemberDates(true);
                            setserviceData(data.item);
                          }}
                          className="bg-[#009688] text-white w-[115px] font-r font-semibold h-[27px] rounded-[20px] text-[11px]"
                        >
                          Set Off Dates
                        </button>
                        <button
                          className="bg-[#009688] text-white w-[115px] font-r font-semibold h-[27px] rounded-[20px] text-[11px]"
                          onClick={() => openModalSchedule(data)}
                        >
                          Custom Shifts
                        </button>
                        <button
                          onClick={() => {
                            setopenShift(true);
                            setmemberId(data.item._id);
                          }}
                          className="bg-[#009688] text-white w-[115px] font-r font-semibold h-[27px] rounded-[20px] text-[11px]"
                        >
                          Set Regular Shift
                        </button>
                        <div className="flex items-center gap-[7px]">
                          <PencilSquareIcon
                            className="text-white h-[20px] cursor-pointer"
                            onClick={() => {
                              setserviceData(data.item);
                              setopen(true);
                            }}
                          />
                          <TrashIcon
                            className="text-white h-[20px] cursor-pointer"
                            onClick={() => handleDelete(data.item._id)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-white  font-r font-semibold text-[12px] pb-[10px]">
                Members are not added yet
              </div>
            )}
          </div>
        )}
      </div>
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px]">
        {openSchedule && (
          <motion.div
            whileInView={{ scale: [0.7, 1], opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            initial="hidden"
            style={{ opacity: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative w-[90%] sm:max-w-[700px] mx-auto">
              <div className="absolute top-[18px] left-[18px] flex justify-between items-center right-[18px] z-20 border-b border-gray-600 pb-[10px]">
                <h2 className="text-[#009688] text-center font-bold font-r text-[22px]">
                  {memberDataModal.first_name + " " + memberDataModal.last_name}
                </h2>
                <div
                  className="h-[28px] w-[28px] cursor-pointer hover:rotate-90 duration-500 bg-[#009688] rounded-full flex justify-center items-center"
                  onClick={closeModalSchedule}
                >
                  <XMarkIcon className="h-[14px] text-white" />
                </div>
              </div>

              <div className=" w-full  rounded-[20px] relative ">
                <div className="bg-[#141414] relative z-10  rounded-[20px] px-[10px] lg:px-[10px] py-[30px] h-full">
                  <div className="mt-[50px] px-[10px] space-y-[15px] max-h-[400px] overflow-auto">
                    <ScheduleShift
                      closeModal={closeModalSchedule}
                      memberDataModal={memberDataModal}
                    />
                  </div>
                </div>
                <div className="absolute inset-[-2px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[20px]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Members;
