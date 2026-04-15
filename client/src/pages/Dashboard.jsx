import { useEffect, useState } from "react";
import swal from "sweetalert";

import "../CSS/Dashboard.css";
import "../CSS/common.css";

const EventBaseURL = "https://my-cal-com-backend.vercel.app";

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("useremail");

    if (!email) {
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

    const name =
      localStorage.getItem("username") ||
      email.split("@")[0];

    const avatarImg =
      localStorage.getItem("userAvatar") ||
      "/Images/avatar2.png";

    setUserEmail(email);
    setUsername(name);
    setAvatar(avatarImg);

    fetchEvents(email);
  }, []);

  async function fetchEvents(email) {
    try {
      const response = await fetch(
        `${EventBaseURL}/events/allevents?userEmail=${email}`
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.AllEvents);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteEvent(id) {
    try {
      const res = await fetch(
        `${EventBaseURL}/events/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            id,
          }),
        }
      );

      if (res.ok) {
        swal(
          "Event Deleted Successfully",
          "Your event has been deleted",
          "info"
        );

        setEvents(prev =>
          prev.filter(event => event._id !== id)
        );

      } else {
        swal("Something went wrong", "", "error");
      }

    } catch (err) {
      swal("Something went wrong", "", "error");
      console.error(err);
    }
  }

  function confirmDelete(id) {
    swal({
      title: "Delete this event?",
      text:
        "Once deleted, notifications for this event stop permanently.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(confirm => {
      if (confirm) deleteEvent(id);
    });
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
      {/* HEADER */}

      <header>
        <div id="navbar" className="margins">
          <div>
            <img
              src="/Images/Icons/MyCalBrand.png"
              alt="logo"
            />
          </div>

          <div id="Logout">
            <div
              className="namecircle"
              onClick={handleLogout}
            >
              <img
                style={{
                  width: "22px",
                  filter: "invert()",
                }}
                src="/Images/logout.svg"
                alt="logout"
              />
            </div>

            <span>
              {userEmail.split("@")[0]}
            </span>
          </div>
        </div>

        <hr
          style={{
            border:
              "1px solid rgba(128,128,128,0.158)",
          }}
        />

        <div id="sticky">
          <div id="topnav">
            <p>My Calendly</p>

            <div className="createandcal">
              <a href="/create">
                <p id="Create">
                  + Create Event
                </p>
              </a>

              <a href="/">
                <p id="Create">
                  My Calendar
                </p>
              </a>
            </div>
          </div>

          <div id="botnav">
            <ul>
              <li>Event Types</li>
              <li>Schedule Event</li>
              <li>Workflows</li>
              <li>Calendar</li>
            </ul>
          </div>
        </div>
      </header>

      {/* USER INFO */}

      <div id="topBody" className="margins">
        <div>
          <div>
            <img
              id="Avatarimg"
              src={avatar}
              alt="avatar"
            />
          </div>

          <div>
            <p>{username}</p>

            <a href="#">
              MyCal.com/{username}
            </a>
          </div>
        </div>

        <div>
          <a
            href="/create"
            style={{
              color: "rgb(0,119,255)",
              fontWeight: 400,
            }}
          >
            + New Event Type
          </a>
        </div>
      </div>

      <hr className="margins" />

      {/* EVENTS LIST */}

      <div id="content" className="margins">

        {events.length === 0 ? (
          <>
            <h2>
              You don't have any event types yet.
            </h2>

            <p>
              Add an event type so people can
              schedule with you.
            </p>
          </>
        ) : (
          events.map(event => {
            const startDate =
              event.start
                .split("T")[0]
                .split("-")
                .reverse()
                .join("-");

            const time =
              event.end.split("T")[1];

            const link =
              event.event_link.replace(
                /\s/g,
                "-"
              );

            return (
              <div
                key={event._id}
                id="event_card"
              >
                <div>
                  <p>{event.title}</p>

                  <hr
                    className="colorHR"
                    style={{
                      backgroundColor:
                        event.color,
                    }}
                  />
                </div>

                <div>
                  <p>
                    <span
                      style={{
                        color: "#075cd4",
                      }}
                    >
                      Date:
                    </span>{" "}
                    {startDate}
                  </p>

                  <p>
                    <span
                      style={{
                        color: "#075cd4",
                      }}
                    >
                      Time:
                    </span>{" "}
                    {time}
                  </p>

                  <p>
                    <span
                      style={{
                        color: "#075cd4",
                      }}
                    >
                      Type:
                    </span>{" "}
                    {event.place}
                  </p>
                </div>

                <hr />

                <div id="link">
                  Link:
                  <a
                    href="#"
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {link}/.event.mycal.com
                  </a>
                </div>

                <button
                  className="Deleter"
                  onClick={() =>
                    confirmDelete(
                      event._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            );
          })
        )}

      </div>
    </>
  );
}