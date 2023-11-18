import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { useState } from "react";
import axios from "axios";
import React, { useEffect } from "react";

import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dutyStatus, setDutyStatus] = useState("notStarted");
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState("");

  useEffect(() => {
    fetchCurrentDutyDetails();
  }, []);

  useEffect(() => {
    let intervalId;

    if (dutyStatus === "started" && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 60000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [dutyStatus, startTime]);

  const startDuty = async () => {
    let siteId, jobId;
    try {
      const token = localStorage.getItem("token");

      console.log(token);
      if (!token) {
        console.error("No token found in localStorage");
        alert("UnAuthorised")
        return;
      }

      const jobListResponse = await fetch("/user/myJobList", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (jobListResponse.ok) {
        const responseData = await jobListResponse.json();

        siteId = responseData.data[0].site_id?._id;
        jobId = responseData.data[0]?._id;
      } else {
        console.error("Failed to fetch job list");
        alert("Failed to fetch job list")
        return;
      }

      const start = new Date();
      setStartTime(start);

      const response = await fetch("/user/startDuty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          site_id: siteId,
          job_id: jobId,
          checkin_time: start.toISOString(),
        }),
      });

      if (response.ok) {
        setDutyStatus("started");
        const data = await response.json();

        console.log("Duty started successfully", data);
      } else {
        setDutyStatus("notStarted");
        const errorData = await response.json();

        console.error("Failed to start duty:", errorData.error);
        alert( errorData.error);
      }
    } catch (error) {
      console.error("Error in starting duty:", error.error);
      alert( error.error);
    }
  };

  const endDuty = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch("/user/endDuty", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const responseData = await response.json();
      if (responseData.status === 200) {
        setDutyStatus("ended");
        console.log("Duty ended successfully", responseData.data);
      } else {
        console.error("Failed to end duty:", responseData.error);
        alert(responseData.error)
      }
    } catch (error) {
      console.error("Error in ending duty:", error.error);
      alert(error.error)
    }

    setDutyStatus("notStarted");
  };
  const fetchCurrentDutyDetails = async () => {
    try {
      const response = await fetch("/user/todayDuty", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const responsedata = await response.json();

        const { checkin_time, checkout_time, date, startTime, endTime } =
          responsedata.data;

        if (checkin_time) {
          const datePart = responsedata.data.date.split("T")[0];
          const completeCheckinTime = new Date(`${datePart}T${checkin_time}`);

          setStartTime(completeCheckinTime);

          if (!checkout_time) {
            const currentTime = new Date();
            console.log("checkin_time", completeCheckinTime);
            console.log("currentTime", currentTime);

            const elapsedMilliseconds = currentTime - completeCheckinTime;
            console.log(elapsedMilliseconds);

            const elapsedHours = Math.floor(
              elapsedMilliseconds / (1000 * 60 * 60)
            );
            const elapsedMinutes = Math.floor(
              (elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
            );

            console.log(elapsedHours, elapsedMinutes);

            setElapsedTime({
              hours: elapsedHours,
              minutes: elapsedMinutes,
            });

            setDutyStatus("started");
            console.log(dutyStatus);
          } else {
            clearInterval(timer);
            setDutyStatus("notStarted");
          }
        } else {
          setDutyStatus("notStarted");
          setStartTime(null);
        }
      } else {
        console.error(
          "Failed to fetch current duty details:",
          response.data.error
        );
        alert(response.data.error)
      }
    } catch (error) {
      console.error("Error in fetching current duty details:", error.message);
      alert(error.error)
    }
  };

  const calculateElapsedTime = () => {
    if (startTime) {
      const currentTime = new Date();
      const elapsedMilliseconds = currentTime - startTime;
      const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
      const elapsedMinutes = Math.floor(
        (elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );

      return `${elapsedHours} hours and ${elapsedMinutes} minutes`;
    } else {
      return "Not started";
    }
  };
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          {dutyStatus === "notStarted" && (
            <Button
              onClick={startDuty}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              Start Duty
            </Button>
          )}
          <Typography>Elapsed Time: {calculateElapsedTime()}</Typography>
          {(dutyStatus === "started" || dutyStatus === "ended") && (
            <Button
              onClick={endDuty}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              End Duty
            </Button>
          )}
        </Box>

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="24"
            subtitle="Present"
            progress="0.75"
            increase="+14%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="6"
            subtitle="Absent"
            progress="0.50"
            increase="+21%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="4.6"
            subtitle="Rating"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="134"
            subtitle="Incident Repoted"
            progress="0.80"
            increase="+13%"
            icon={
              <NewReleasesIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;