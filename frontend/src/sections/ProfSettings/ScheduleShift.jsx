import React, { useState, useEffect } from "react";
import axios from "axios";
import timeOptions from "./timeOptions";
//import Spinner from "./spinner";
import AddBreakTime from "./addBreakTime";
//import DeleteModal from "./deleteModal";
import { BACKEND_URL } from "../../constant";
import { CircularProgress } from "@mui/material";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const ScheduleShift = ({ closeModal, memberDataModal }) => {
  //const matches = UseMediaQuery("(max-width: 992px)");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = process.env.REACT_APP_API_URL;
  //const token = localStorage.getItem("userToken");
  const token = localStorage.getItem("token");
  const [memberData, setMemberData] = useState();
  const [loading, setLoading] = useState(false);
  const [slotData, setSlotData] = useState();
  const [startTimeForEdit, SetStartTimeForEdit] = useState();
  const [endTimeForEdit, SetEndTimeForEdit] = useState();
  const [breakSlotId, setBreakSlotId] = useState();
  const [modalIsOpenDelete, setIsOpenModalDelete] = useState(false);
  const [deleteBreakId, setDeleteBreakId] = useState();
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [slotDateForEdit, setSlotDateForEdit] = useState();
  const [slotDateForBreak, setSlotDateForBreak] = useState();
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [editSlotId, setEditSlotId] = useState();
  const [weekDates, setWeekDates] = useState();
  const [breakActionType, setBreakActionType] = useState();
  const [breakStartTimeEdit, setBreakStartTimeEdit] = useState();
  const [breakEndTimeEdit, setBreakEndTimeEdit] = useState();
  const [breakIdEdit, setBreakIdEdit] = useState();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [matchDay, setMatchDay] = useState(7);

  // useEffect(() => {
  //   console.log("hereee");
  //   getWeekDates();
  //   fetchData();
  //   // if (matches) {
  //   //   setMatchDay(1);
  //   // }
  // }, []);

  useEffect(() => {
    getWeekDates();

    if (memberDataModal && memberDataModal._id) {
      fetchData();
    }
  }, [memberDataModal]);

  const getWeekDates = (weekDate) => {
    const today = weekDate ? weekDate : new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    // if (!matches) {
    //   startDate.setDate(today.getDate() - currentDay); // Start of the week (Sunday as the first day)
    // }
    const weekDatesD = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      //setWeekStartDate(currentDate)
      currentDate.setDate(startDate.getDate() + i);
      weekDatesD.push(currentDate);
    }
    setWeekDates(weekDatesD);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        BACKEND_URL + "/slot/get-slot-by-memberid/" + memberDataModal._id,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        }
      );
      if (response) {
        setSlotData(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleDate = (type) => {
    const clonedDate = new Date(weekDates[0]);

    // Add 7 days to the cloned date
    if (type === "next") {
      clonedDate.setDate(clonedDate.getDate() + matchDay);
    } else {
      clonedDate.setDate(clonedDate.getDate() - matchDay);
    }

    getWeekDates(clonedDate);
  };

  const findShiftDataIndex = (slotDate) => {
    if (slotData && slotData.length > 0) {
      const givenDate = new Date(slotDate);
      // Convert date to "y-m-t" format
      const formattedDate = `${givenDate.getFullYear()}-${(
        givenDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${givenDate.getDate().toString().padStart(2, "0")}`;
      const index = slotData.findIndex(
        (user) => user.slot_Date === formattedDate
      );

      return index;
    }
  };

  const openModalDelete = (id) => {
    setDeleteBreakId(id);
    setIsOpenModalDelete(true);
  };

  const closeModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteBreak = async () => {
    setLoadingDelete(true);
    try {
      await axios
        .delete(BACKEND_URL + "/slot/break-time/" + deleteBreakId, {
          headers: { authorization: "Bearer " + token },
        })
        .then(function (response) {
          //toastSuccess("Break Time updated successfully");
          setLoadingDelete(false);
          fetchData();
          setIsOpenModalDelete(false);
        })
        .catch(function (error) {
          //toastError(error.response.data.message || "Break Time not updated");
          console.log(error);
          setLoadingDelete(false);
          setIsOpenModalDelete(false);
        });
    } catch (error) {
      setLoadingDelete(false);
      console.error("Error:", error);
      setIsOpenModalDelete(false);
    }
  };

  const getBreakTimes = (slotDate) => {
    let index = findShiftDataIndex(slotDate);
    if (index > -1) {
      let breakTime = slotData[index].break_time;
      const breakTimeDiv = [];
      if (breakTime && breakTime.length > 0) {
        breakTime.map((time) => {
          breakTimeDiv.push(
            <div className="">
              <span className="breakCls rounded px-1 py-2 text-xs mt-1 block">
                {time.start_time + " - " + time.end_time}
              </span>
              <button
                onClick={() =>
                  handleAddBreakTime(
                    slotDate,
                    "edit",
                    time.start_time,
                    time.end_time,
                    time._id
                  )
                }
              >
                <PencilSquareIcon
                  className="h-[20px] w-[20px]"
                  src="img/edit.png"
                />
              </button>
              <button onClick={() => openModalDelete(time._id)}>
                <TrashIcon
                  className="h-[14px] w-[14px]"
                  src="img/Delete2.png"
                />
              </button>
            </div>
          );
        });
      }
      return breakTimeDiv;
    }
  };

  const getSlots = (slotDate) => {
    let index = findShiftDataIndex(slotDate);
    if (index > -1) {
      return slotData[index].start_time + " - " + slotData[index].end_time;
    }
  };

  const handleAddBreakTime = (
    slotDate,
    action,
    start_time,
    end_time,
    breakIdEdit
  ) => {
    setBreakActionType(action);
    setBreakStartTimeEdit(start_time);
    setBreakEndTimeEdit(end_time);
    setBreakIdEdit(breakIdEdit);
    let day = slotDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    let index = findShiftDataIndex(slotDate);
    if (index > -1) {
      setBreakSlotId(slotData[index]._id);
    }
    setSlotDateForBreak(day);
  };

  const closeBreak = () => {
    setBreakSlotId("");
    setSlotDateForBreak("");
    setBreakActionType("");
    setBreakStartTimeEdit("");
    setBreakEndTimeEdit("");
    setBreakIdEdit("");
  };

  const handleEditSlotTime = (slotDate) => {
    let day = slotDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    let index = findShiftDataIndex(slotDate);
    if (index > -1) {
      SetStartTimeForEdit(slotData[index].start_time);
      SetEndTimeForEdit(slotData[index].end_time);
      setEditSlotId(slotData[index]._id);
    }
    setSlotDateForEdit(day);
    setEditSlotOpen(true);
  };

  const closeModalEditSlot = () => {
    setEditSlotOpen(false);
    setSlotDateForEdit("");
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === "startTimeForEdit") {
      SetStartTimeForEdit(value);
    } else {
      SetEndTimeForEdit(value);
    }
  };

  const handleEditSubmit = async () => {
    setLoadingEdit(true);
    let data = {};
    data["start_time"] = startTimeForEdit;
    data["end_time"] = endTimeForEdit;
    try {
      await axios
        .put(API_URL + "slot/update-slot/" + editSlotId, data, {
          headers: { authorization: "Bearer " + token },
        })
        .then(function (response) {
          setEditSlotOpen(false);
          setSlotDateForEdit("");
          fetchData();
          //toastSuccess("Time Slot updated successfully");
          setLoadingEdit(false);
        })
        .catch(function (error) {
          //toastError(error.response.data.message || "Time Slot not updated");
          console.log(error);
          setLoadingEdit(false);
          setEditSlotOpen(false);
          setSlotDateForEdit("");
          fetchData();
        });
    } catch (error) {
      setEditSlotOpen(false);
      setSlotDateForEdit("");
      fetchData();
      setLoadingEdit(false);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className=" ">
        <div className="mt-4">
          {!loading && weekDates ? (
            <>
              <div className="block mt-5 mb-5">
                {weekDates ? (
                  <div className="inline border border-grey rounded-2xl p-2 bg-white ">
                    <div
                      onClick={() => handleDate("prev")}
                      className="cursor-pointer inline border-r p-2"
                    >
                      <ArrowLeftCircleIcon className="inline h-[15px]  cursor-pointer" />
                    </div>
                    <span className="inline ml-2 mr-2">
                      {weekDates[0].toLocaleDateString("en-US", {
                        //weekday: "short",
                        //year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {/* {!matches ? (
                        <>
                          -{" "}
                          {weekDates[6].toLocaleDateString("en-US", {
                            //weekday: "short",
                            //year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </>
                      ) : (
                        ""
                      )} */}
                    </span>
                    <div
                      onClick={() => handleDate("next")}
                      className="cursor-pointer inline border-l p-2"
                    >
                      <ArrowRightCircleIcon className="inline h-[15px]  cursor-pointer" />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="w-full">
                <div className="p-2 border border-grey-9 grid grid-cols-7 lg:grid-cols-7 md:grid-cols-7 sm:grid-cols-7 xs:grid-cols-1 xxs:grid-cols-1">
                  {weekDates.map((dayy) => {
                    return (
                      <>
                        <div className="text-center text-white">
                          {dayy.toLocaleDateString("en-US", {
                            weekday: "short",
                            //year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </>
                    );
                  })}
                </div>

                <div className=" border border-grey-9 grid grid-cols-7 lg:grid-cols-7 md:grid-cols-7 sm:grid-cols-7 xs:grid-cols-1 xxs:grid-cols-1">
                  {weekDates.map((dayy) => {
                    return (
                      <>
                        <div className="text-center py-2 border border-grey-9 text-white">
                          {getSlots(dayy) ? (
                            <>
                              <div>
                                <span className="bg-blue2 rounded px-1 py-2 text-xs block">
                                  {getSlots(dayy)}
                                </span>
                                <button
                                  onClick={() => handleEditSlotTime(dayy)}
                                  className="align-middle"
                                >
                                  <PencilSquareIcon className="h-[20px] w-[20px]" />
                                </button>
                                <button
                                  onClick={() => handleAddBreakTime(dayy)}
                                  className="align-middle"
                                >
                                  <PlusIcon className="h-[20px] w-[20px] font-bold" />
                                </button>
                              </div>
                              {getBreakTimes(dayy) ? (
                                <div className="mt-2">
                                  {getBreakTimes(dayy)}
                                </div>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <CircularProgress sx={{ color: "white" }} />
            </div>
            // <Spinner />
          )}
        </div>
      </div>

      {editSlotOpen ? (
        <div className="p-2 lg:p-3 md:p-3 sm:p-3 xs:p-2 xxs:p-2 bg-white1 ">
          <div className="mt-4">
            <div className="block border-b border-grey9 pb-3 mb-3 text-black2 font-bold text-lg lg:text-lg md:text-lg sm:text-base xs:text-sm xxs:text-sm ">
              <div className="inline-block">{slotDateForEdit}</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 xxs:grid-cols-1">
              <div className="mt-1">
                <label htmlFor="startTimeForEdit" className="text-lg">
                  Start Time :
                </label>
                <select
                  name="startTimeForEdit"
                  className="ml-2 p-2 border border-grey-9 rounded"
                  id="startTimeForEdit"
                  value={startTimeForEdit}
                  onChange={handleTimeChange}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="">
                <label htmlFor="endTimeForEdit" className="text-lg">
                  End Time :
                </label>
                <select
                  name="endTimeForEdit"
                  className="ml-2 p-2 border border-grey-9 rounded"
                  id="endTimeForEdit"
                  value={endTimeForEdit}
                  onChange={handleTimeChange}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="float-right mt-4">
              {loadingEdit ? (
                <Spinner /> // Show the spinner while loading
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => closeModalEditSlot()}
                    className="mr-3 text-base font-bold bg-grey2 text-white py-2.5 px-4 shadowEffect hover:opacity-60"
                  >
                    Cancel
                  </button>
                  <input
                    onClick={() => handleEditSubmit()}
                    type="submit"
                    value="Update"
                    name="Update"
                    className="font-bold bg-green1 text-white py-2.5 px-4 text-base shadowEffect hover:opacity-60"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {breakSlotId ? (
        <AddBreakTime
          breakStartTimeEdit={breakStartTimeEdit}
          breakEndTimeEdit={breakEndTimeEdit}
          breakActionType={breakActionType}
          fetchData={fetchData}
          memberId={memberDataModal._id}
          closeBreak={closeBreak}
          breakSlotId={breakSlotId}
          slotDateForBreak={slotDateForBreak}
          breakIdEdit={breakIdEdit}
        />
      ) : (
        ""
      )}

      {modalIsOpenDelete ? (
        <div className="p-2 lg:p-3 md:p-3 sm:p-3 xs:p-2 xxs:p-2 bg-white1 text-white">
          <div className="mt-4">
            {/* <div className="block border-b border-grey9 pb-3 mb-3 text-black2 font-bold text-lg lg:text-lg md:text-lg sm:text-base xs:text-sm xxs:text-sm ">
              <div className="inline-block">Delete</div>
            </div> */}
            <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 xxs:grid-cols-1">
              Are you sure want to Delete ?
            </div>

            <div className="float-right mt-4">
              {loading ? (
                <CircularProgress sx={{ color: "white" }} /> // Show the spinner while loading
              ) : (
                <>
                  <button
                    onClick={closeModalDelete}
                    className="mr-3 text-base font-bold bg-grey2 text-white py-2.5 px-4 shadowEffect hover:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteBreak}
                    className="font-bold bg-green1 text-white py-2.5 px-4 text-base shadowEffect hover:opacity-60"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* <Model
        modalIsOpen={modalIsOpenDelete}
        closeModal={closeModalDelete}
        content={
          <DeleteModal
            closeModalDelete={closeModalDelete}
            title="Break Time"
            handleDelete={handleDeleteBreak}
            loading={loadingDelete}
          />
        }
        dialogClassName="modal-width-30"
      /> */}
    </>
  );
};

export default ScheduleShift;
