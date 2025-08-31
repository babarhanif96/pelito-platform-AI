import React, { useState, useContext } from "react";
//import { toastSuccess, toastError } from "../hooks/toaster";
import axios from "axios";
import timeOptionsHalfHour from "./timeOptionsHalfHour";
//import Spinner from "./spinner";
import StatesContext from "../../context/StatesContext";
import { BACKEND_URL } from "../../constant";

const AddBreakTime = ({
  breakIdEdit,
  breakStartTimeEdit,
  breakEndTimeEdit,
  breakActionType,
  fetchData,
  memberId,
  breakSlotId,
  slotDateForBreak,
  closeBreak,
}) => {
  const context = useContext(StatesContext);
  const { state } = context;
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [breakStartTime, SetBreakStartTime] = useState(breakStartTimeEdit);
  const [breakEndTime, SetBreakEndTime] = useState(breakEndTimeEdit);
  const [loading, setLoading] = useState();

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === "breakStartTime") {
      SetBreakStartTime(value);
    } else {
      SetBreakEndTime(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    let data = {};
    data["salon_id"] = state.user._id;
    data["member_id"] = memberId;
    data["slot_id"] = breakSlotId;
    data["start_time"] = breakStartTime;
    data["end_time"] = breakEndTime;
    if (breakActionType === "edit") {
      try {
        await axios
          .put(BACKEND_URL + "/slot/break-time/" + breakIdEdit, data, {
            headers: {
              authorization: "Bearer " + token,
              //"Content-Type": "multipart/form-data",
              // Add any other necessary headers
            },
          })
          .then(function (response) {
            //toastSuccess("Break Time updated successfully");
            setLoading(false);
            closeBreak();
            fetchData();
          })
          .catch(function (error) {
            //toastError(error.response.data.message || "Break Time not updated");
            console.log(error);
            setLoading(false);
            closeBreak();
          });
      } catch (error) {
        closeBreak();
        setLoading(false);
        console.error("Error:", error);
      }
    } else {
      try {
        await axios
          .post(BACKEND_URL + "/slot/break-time", data, {
            headers: {
              authorization: "Bearer " + token,
            },
          })
          .then(function (response) {
            //toastSuccess("Break Time updated successfully");
            setLoading(false);
            closeBreak();
            fetchData();
          })
          .catch(function (error) {
            //toastError(error.response.data.message || "Break Time not updated");
            console.log(error);
            setLoading(false);
            closeBreak();
          });
      } catch (error) {
        closeBreak();
        setLoading(false);
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="p-2 lg:p-3 md:p-3 sm:p-3 xs:p-2 xxs:p-2 bg-white1 ">
      <div className="mt-4">
        <div className="block border-b border-grey9 pb-3 mb-3 text-white font-bold text-lg lg:text-lg md:text-lg sm:text-text-base xs:text-sm xxs:text-sm ">
          <div className="inline-block">
            {breakActionType ? "Update" : "Add"} Break Time for -{" "}
            {slotDateForBreak}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 xxs:grid-cols-1">
          <div className="mt-1">
            <label htmlFor="breakStartTime" className="text-lg text-white">
              Start Time :
            </label>
            <select
              name="breakStartTime"
              className="ml-2 p-2 border border-grey-9 rounded"
              id="breakStartTime"
              value={breakStartTime}
              onChange={handleTimeChange}
            >
              {timeOptionsHalfHour.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <label htmlFor="breakEndTime" className="text-lg text-white">
              End Time :
            </label>
            <select
              name="breakEndTime"
              className="ml-2 p-2 border border-grey-9 rounded"
              id="breakEndTime"
              value={breakEndTime}
              onChange={handleTimeChange}
            >
              {timeOptionsHalfHour.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="float-right mt-4">
          {loading ? (
            <></>
          ) : (
            // <Spinner /> // Show the spinner while loading
            <>
              <button
                type="button"
                onClick={() => closeBreak()}
                className="mr-2 bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px]  h-[32px] rounded-[7px]"
              >
                Cancel
              </button>
              <input
                onClick={() => handleSubmit()}
                type="submit"
                value={breakActionType ? "Update" : "Add"}
                name="Update"
                className="bg-[#009688] text-white font-r font-medium text-[12px] sm:text-[13px] w-[100px]  h-[32px] rounded-[7px]"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBreakTime;
