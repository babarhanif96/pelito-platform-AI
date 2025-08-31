import React, { useContext, useState } from "react";
import Nav from "../../../components/Nav";
import SideBar from "../../../components/Sidebar";

import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "../../../components/DashboardHeader";
import { BACKEND_URL } from "../../../constant";
import StatesContext from "../../../context/StatesContext";
import Table from "../../../components/Table";
import { getDateFormate } from "../../../utils";

const ProfAppointmentList = () => {
  const tableHead = [
    "Customer",
    "Number",
    "Service",
    "Member ",
    "Date",
    "Time",
    "Amount",
    "Network Fees",
    "Status",
    "Action",
  ];

  const context = useContext(StatesContext);
  const { state } = context;

  const [memberSelected, setMemberSelected] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["appointment-list", memberSelected],
    queryFn: () => {
      const token = localStorage.getItem("token");
      return fetch(
        `${BACKEND_URL}/service/seller-report/${state.user._id}?memberId=${memberSelected}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(async (res) => await res.json());
    },
  });

  const { data: memberData } = useQuery({
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

  const handleDownload = () => {
    if (!filteredData || filteredData.length === 0) {
      console.log("No data available for download.");
      return;
    }

    const processedData = filteredData.map(
      ({
        member_id,
        customer_user_id,
        service_id,
        booking_time,
        professional_service_fee,
        day,
      }) => ({
        MemberName: member_id.first_name + " " + member_id.last_name,
        CustomerName: customer_user_id.first_name,
        CustomerEmail: customer_user_id.email,
        CustomerPhoneNumber: customer_user_id.phone_number,
        ServiceName: service_id.service_name,
        BookingTime: booking_time,
        BookingPeriod: service_id.period + " min",
        Price: service_id.price,
        ProfessionalServiceFee: professional_service_fee,
        Date: getDateFormate(day),
      })
    );

    const csvData = convertToCSV(processedData);
    downloadCSV(csvData);
  };

  const downloadCSV = (csvData) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(","));
    return header + "\n" + rows.join("\n");
  };

  const filterDataByDate = (data) => {
    if (!data) return [];

    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    return data.filter((appointment) => {
      const appointmentDate = appointment.day;

      switch (dateFilter) {
        case "today":
          return appointmentDate === today;
        case "tomorrow":
          return appointmentDate === tomorrowDate;
        case "this_week": {
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return (
            new Date(appointmentDate) >= startOfWeek &&
            new Date(appointmentDate) <= endOfWeek
          );
        }
        case "this_month": {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const appointmentDateObj = new Date(appointmentDate);
          return (
            appointmentDateObj.getMonth() === currentMonth &&
            appointmentDateObj.getFullYear() === currentYear
          );
        }
        case "custom":
          if (startDate && endDate) {
            return (
              new Date(appointmentDate) >= new Date(startDate) &&
              new Date(appointmentDate) <= new Date(endDate)
            );
          }
          return true;
        default:
          return true; // "all" option
      }
    });
  };

  const filteredData = filterDataByDate(data);

  return (
    <div className="">
      <Nav />

      <SideBar />
      <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] md:pt-0 min-h-screen bg-[#25262B] relative ">
        <div className="px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1120px] mx-auto pt-[10px] pb-[40px] sm:pb-[20px]">
          <DashboardHeader title="Appointments List" />

          <div className=" mt-[30px]">
            <div className="flex justify-between items-center gap-[20px]">
              <div className="inline-block  mt-1">
                <label className="text-white font-n text-[14px] mr-[10px] font-semibold">
                  Member :{" "}
                </label>
                <select
                  name="member"
                  className=" bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] h-[30px] pl-[5px] pr-[25px] rounded-[7px] max-h-[100px] overflow-y-auto"
                  value={memberSelected}
                  onChange={(e) => setMemberSelected(e.target.value)}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 2px center", // Moves the arrow
                    backgroundSize: "20px",
                  }}
                >
                  <option
                    value=""
                    className="bg-[#242424] text-white text-left"
                  >
                    All
                  </option>
                  {memberData &&
                    memberData.length > 0 &&
                    memberData.map((members) => {
                      let member = members.item;
                      return (
                        <option
                          className="bg-[#242424] text-white text-left"
                          key={member._id}
                          value={member._id}
                        >
                          {member.first_name + " " + member.last_name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="inline-block mt-1">
                <label className="text-white font-semibold text-[14px] mr-[10px]">
                  Date:
                </label>
                {/* <select
                  className="bg-[rgba(225,225,225,0.08)] text-white text-[12px] h-[30px] pl-[5px] pr-[25px] rounded-[7px]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="custom">Custom Date</option>
                </select> */}
                <select
                  className="bg-[rgba(225,225,225,0.08)] outline-none text-white text-[12px] h-[30px] pl-[5px] pr-[25px] rounded-[7px]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 2px center", // Moves the arrow
                    backgroundSize: "20px",
                  }}
                >
                  <option value="all" className="bg-[#242424] text-white text-left">
                    All
                  </option>
                  <option value="today" className="bg-[#242424] text-white text-left">
                    Today
                  </option>
                  <option value="tomorrow" className="bg-[#242424] text-white text-left">
                    Tomorrow
                  </option>
                  <option value="this_week" className="bg-[#242424] text-white text-left">
                    This Week
                  </option>
                  <option value="this_month" className="bg-[#242424] text-white text-left">
                    This Month
                  </option>
                  <option value="custom" className="bg-[#242424] text-white text-left">
                    Custom Date
                  </option>
                </select>

              </div>

              {dateFilter === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="ml-2 bg-[rgba(225,225,225,0.08)] text-white text-[12px] h-[30px] px-[5px] rounded-[7px]"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="ml-2 bg-[rgba(225,225,225,0.08)] text-white text-[12px] h-[30px] px-[5px] rounded-[7px]"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}

              <button
                onClick={() => handleDownload()}
                className="w-[90px] sm:w-[110px] h-[33px] sm:h-[37px]  rounded-[8px] text-white bg-[#F57C00] font-n font-medium text-[12px] sm:text-[14px]"
              >
                Download
              </button>
            </div>

            <div className="relative mt-[20px]">
              <div className="relative z-10 bg-[#141414] flex flex-col items-center w-full p-[15px] rounded-[10px]">
                <Table
                  tableHead={tableHead}
                  //data={data}
                  data={filteredData}
                  isFetching={isLoading}
                />
              </div>
              <div className="absolute inset-[-1px] bg-gradient-to-b from-[#009688] to-[#141414] rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfAppointmentList;
