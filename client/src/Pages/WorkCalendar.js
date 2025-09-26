// client/src/components/CalendarView.jsx
import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  subMonths,
  addMonths,
  isSameDay,
  isToday,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import "../App.css";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WorkCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dailyStatuses, setDailyStatuses] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusesList = async () => {
      try {
        const res = await fetch(`/api/admin/calendarStatusCategories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setStatuses(data || []);
        }
      } catch (error) {
        console.error("Error fetching statuses list:", error);
      }
    };
    fetchStatusesList();
  }, []);

  useEffect(() => {
    const fetchDailyStatuses = async () => {
      const month = format(currentDate, "yyyy-MM");
      try {
        const res = await fetch(`/api/calendar/${month}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setDailyStatuses(data.statuses || []);
        } else {
          console.error("Error fetching calendar data");
        }
      } catch (error) {
        console.error("Error fetching tasks by date:", error);
      }
    };
    fetchDailyStatuses();
  }, [currentDate]);

  const handleDayClick = async (day) => {
    setSelectedDate(day);
    try {
      const dateStr = format(day, "yyyy-MM-dd");
      const res = await fetch(`/api/tasks/tasksByDate?date=${dateStr}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data || []);
      } else {
        console.error("Error fetching tasks by date");
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks by date:", error);
    }

    let selectedDay = dailyStatuses.find(
      (s) => s.date === format(day, "yyyy-MM-dd")
    );
    setSelectedDay(selectedDay || null);
  };

  const getStatusLabel = (day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const status = dailyStatuses.find((s) => s.date === dayStr);
    if (!status) return { statusName: "", statusDisplayName: "" };
    else {
      return {
        statusName:
          statuses.find((s) => s.id === status.category_id)?.name || "",
        statusDisplayName:
          statuses.find((s) => s.id === status.category_id)?.displayName || "",
      };
    }
  };

  const renderCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const allDays = eachDayOfInterval({ start, end });

    // Monday-first blank days calculation
    const leadingBlanks = (getDay(start) + 6) % 7; // map Sun(0)->6, Mon(1)->0...
    const blankDays = Array.from({ length: leadingBlanks }, () => null);

    // trailing blanks to fill last week
    const totalCells = Math.ceil((blankDays.length + allDays.length) / 7) * 7;
    const trailingCount = totalCells - (blankDays.length + allDays.length);
    const trailingBlanks = Array.from({ length: trailingCount }, () => null);

    const calendarDays = [...blankDays, ...allDays, ...trailingBlanks];

    return calendarDays.map((day, idx) => {
      if (!day)
        return <div key={`blank-${idx}`} className="calendarCell empty" />;

      const { statusName, statusDisplayName } = getStatusLabel(day);
      const selected = isSameDay(day, selectedDate);

      return (
        <div
          key={day.toISOString()}
          className={`calendarCell ${statusName} ${
            isToday(day) ? "today" : ""
          } ${selected ? "selected" : ""}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="day-number">{format(day, "d")}</div>
          <div className="status-label">{statusDisplayName}</div>
        </div>
      );
    });
  };

  const changeDayStatus = async () => {
    if (!selectedDay) {
      alert("Please select a day with existing status to change.");
      return;
    }
    const response = await fetch(`/api/calendar/changeDayStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dayID: selectedDay.id,
        category_id: selectedDay.category_id,
      }),
    });
    if (response.ok) {
      alert("Day status updated successfully.");
      // Refresh statuses
      const month = format(currentDate, "yyyy-MM");
      const res = await fetch(`/api/calendar/${month}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setDailyStatuses(data.statuses || []);
      }
    } else {
      alert("Failed to update day status.");
    }
  };

  return (
    <div className="calendarPageContainer">
      <div className="calendarContainer">
        <div className="calendarHeader">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            &lt;
          </button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            &gt;
          </button>
        </div>

        <div className="calendarGrid">
          {daysOfWeek.map((d) => (
            <div key={d} className="calendar-day-name">
              {d}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
      <div className="tasksContainer">
        <h2>Details</h2>
        {!selectedDate && (
          <span className="noDaySelectedForDetails">
            Odaberite dan u kalendaru za pregled detalja
          </span>
        )}
        {selectedDate && (
          <>
            <div className="taskDetails">
              <h3>Tasks for {format(selectedDate, "dd.MM.yyyy")}</h3>
              {tasks.length ? (
                <ul>
                  {tasks.map((t) => (
                    <li key={t.id}>
                      <strong>{t.minutes} min</strong> —{" "}
                      {t.description || t.subtask_name || ""}{" "}
                      {t.employer_name ? `(${t.employer_name})` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="noTaskToshow">No tasks to show</p>
              )}
              <button
                onClick={() =>
                  navigate(
                    `/addTask?date=${format(selectedDate, "yyyy-MM-dd")}`
                  )
                }
              >
                Add Task
              </button>
            </div>
            <div className="changeDayStatus">
              <h3>Change Day Status</h3>
              <select
                onChange={(e) => {
                  const newCatId = parseInt(e.target.value);
                  setSelectedDay((prev) =>
                    prev ? { ...prev, category_id: newCatId } : prev
                  );
                }}
                value={selectedDay ? selectedDay.category_id : ""}
              >
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.displayName}
                  </option>
                ))}
              </select>
              <button onClick={changeDayStatus}>Change Status</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkCalendar;
