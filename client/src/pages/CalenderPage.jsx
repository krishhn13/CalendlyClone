import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import swal from "sweetalert";

import "../CSS/calendar.css";
import "../CSS/Navbar.css";
import "../CSS/Dashboard.css";
import "../CSS/common.css";

const EventBaseURL = "https://my-cal-com-backend.vercel.app";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const calendarRef = useRef(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("useremail");

    if (!userEmail) {
      swal(
        "Please Login First!",
        "You need to login before adding any events..",
        "info"
      );

      setTimeout(() => {
        window.location.href = "/loginSignup.html";
      }, 2000);

      return;
    }

    setUsername(userEmail.split("@")[0]);

    fetchEvents(userEmail);
  }, []);

  async function fetchEvents(userEmail) {
    try {
      setLoading(true);

      const response = await fetch(
        `${EventBaseURL}/events/allevents?userEmail=${userEmail}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.AllEvents.length === 0) {
          setEvents(dummyEvents);
        } else {
          setEvents(data.AllEvents);
        }
      }
    } catch (err) {
      console.log(err);
      setEvents(dummyEvents);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    swal("Logging Out..", "", "info");

    localStorage.clear();

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  return (
    <>
      {loading && (
        <div id="spinner">
          <img
            style={{ width: "70px" }}
            src="/Images/spinner.gif"
            alt="loading"
          />
        </div>
      )}

      {/* HEADER */}

      <header id="Header">
        <div id="navbar" className="margins">
          <div>
            <a href="/Dashboard.html">
              <img src="/Images/Icons/MyCalBrand.png" alt="logo" />
            </a>
          </div>

          <div id="linav">
            <ul>
              <li>
                <a href="/Dashboard.html">Home</a>
              </li>
              <li>
                <a href="/Dashboard.html">Availability</a>
              </li>
              <li>
                <a href="/Dashboard.html">Integrations</a>
              </li>
            </ul>
          </div>

          <div id="Logout">
            <div className="namecircle" onClick={handleLogout}>
              <img
                style={{ width: "22px", filter: "invert()" }}
                src="/Images/logout.svg"
                alt="logout"
              />
            </div>

            <a href="/Dashboard.html">{username}</a>
          </div>
        </div>

        <hr style={{ border: "1px solid rgba(128,128,128,0.158)" }} />

        <div id="sticky">
          <div id="topnav">
            <p>Click On Any Date to create an event</p>

            <div id="botnav">
              <ul>
                <li>
                  <a href="/Dashboard.html">Event Types</a>
                </li>
                <li>
                  <a href="/Dashboard.html">Schedule Event</a>
                </li>
                <li>
                  <a href="/NotifyBeforePage.html">Workflows</a>
                </li>
                <li>
                  <a href="/Dashboard.html">Settings</a>
                </li>
              </ul>
            </div>

            <a href="/CreateEvent.html">
              <p id="Create">+ Create</p>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main>
        <section id="Home">
          <div className="CalendarHold">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              initialDate={new Date()}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
            />
          </div>
        </section>

        <section>
          <center>
            <h1>Mark your events on your calendar.</h1>
          </center>
        </section>
      </main>

      <footer></footer>
    </>
  );
}

/* fallback events */

const dummyEvents = [
  { title: "All Day Event", start: "2023-04-01" },
  {
    title: "Company Long Event",
    start: "2023-04-07",
    end: "2023-04-10",
    color: "red",
  },
  {
    title: "Race Event",
    start: "2023-04-11",
    end: "2023-04-12",
    color: "green",
  },
];