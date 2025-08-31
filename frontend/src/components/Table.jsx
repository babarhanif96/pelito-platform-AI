import { CircularProgress, useMediaQuery } from "@mui/material";
import { getDateFormate } from "../utils";
import StatesContext from "../context/StatesContext";
import { useContext } from "react";
import { BACKEND_URL } from "../constant";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const Table = ({ tableHead, data, isFetching }) => {
  const context = useContext(StatesContext);
  const { state, handleStateChange } = context;

  const queryClient = useQueryClient();

  const handleDelete = async (deleteId) => {
    const token = localStorage.getItem("token");

    handleStateChange({ loader: "Canceling booking" });

    try {
      const response = await axios.put(
        BACKEND_URL + "/service/cancel-booking-by-salon/" + deleteId,
        { headers: { authorization: "Bearer " + token } }
      );
      if (response) {
        handleStateChange({ success: "Booking cancelled successfully" });
        queryClient.invalidateQueries("appointment-list");
      }
    } catch (error) {
    } finally {
      handleStateChange({ loader: "" });
    }
  };

  return (
    <div className="relative rounded-[10px] overflow-x-auto w-full max-h-[400px]">
      <table className="w-full min-w-[1000px] lg:min-w-[900px]">
        <thead
          className="text-[12px] font-medium text-[#87909C]"
          style={{ background: "#141414" }}
        >
          <tr className="border-b-[0.5px] border-gray-700">
            {tableHead.map((item, i) => (
              <th
                scope="col"
                className={`py-[16px] px-[30px] text-center`}
                key={i}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full">
          {!isFetching &&
            data.length > 0 &&
            data.map((serviceData, i) => (
              <tr
                style={{
                  background: "#141414",
                }}
                key={i}
              >
                <td className="text-white text-center text-[12px] py-[10px] font-medium">
                  {serviceData.customer_user_id
                    ? serviceData.customer_user_id.first_name
                    : "-"}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  {serviceData.customer_user_id
                    ? serviceData.customer_user_id.phone_number
                    : "-"}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  {serviceData.service_id
                    ? serviceData.service_id.service_name
                    : "-"}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  {serviceData.member_id
                    ? serviceData.member_id.first_name +
                      " " +
                      serviceData.member_id.last_name
                    : "-"}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  {getDateFormate(serviceData.day)}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  {serviceData.booking_time}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  ${serviceData.orignal_price}
                </td>
                <td className="text-white text-center text-[12px]  font-medium">
                  ${serviceData.tax}
                </td>
                <td
                  className={` ${
                    serviceData.status === "booked" ||
                    serviceData.status === "paid"
                      ? "text-[#FFCF33]"
                      : serviceData.status === "canceled"
                      ? "text-[#F57C00]"
                      : "text-[#009688]"
                  } font-semibold text-center text-[12px] capitalize`}
                >
                  {serviceData.status === "booked" ||
                  serviceData.status === "paid"
                    ? "Paid"
                    : serviceData.status}
                </td>

                <td>
                  {(serviceData.status === "booked" ||
                    serviceData.status === "paid") && (
                    <div className="flex justify-center ">
                      <button
                        type="submit"
                        style={{
                          opacity: serviceData.status === "canceled" && 0.5,
                        }}
                        disabled={serviceData.status === "canceled"}
                        onClick={() => handleDelete(serviceData._id)}
                        className="bg-[#009688] text-white font-r font-medium text-[10px] w-[55px]  h-[22px] rounded-[20px]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          <tr
            style={{
              background: "#141414",
            }}
          >
            {isFetching && (
              <td colSpan={"9"} className="py-[85px] text-center">
                <CircularProgress sx={{ color: "white" }} />
              </td>
            )}
            {!isFetching && data.length === 0 && (
              <td
                colSpan={"9"}
                className="text-[15px] py-[100px] font-medium text-[#87909C] text-center"
              >
                No appointments found!
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
