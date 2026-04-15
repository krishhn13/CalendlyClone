import { useEffect, useState } from "react";
import swal from "sweetalert";

import "../CSS/common.css";
import "../CSS/Dashboard.css";
import "../CSS/create.css";

const EventBaseURL = "https://my-cal-com-backend.vercel.app";

export default function CreateEventPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    place: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    color: "blue",
    event_link: "",
    description: "",
  });

  useEffect(() => {
    const email = localStorage.getItem("useremail");
    const name = localStorage.getItem("username");

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

    setUserEmail(email);
    setUserName(name);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      title,
      place,
      startTime,
      endTime,
      startDate,
      endDate,
      color,
      event_link,
      description,
    } = formData;

    const createdOn = new Date().toISOString().split(".")[0];

    const start = `${startDate}T${startTime}:00`;
    const end = `${endDate}T${endTime}:00`;

    const startValue = +start.replace(/\D/g, "");
    const endValue = +end.replace(/\D/g, "");
    const createValue = +createdOn.replace(/\D/g, "");

    if (startTime >= endTime && endDate <= startDate) {
      swal(
        "Event Start time cannot be after endtime",
        "Please select another time",
        "info"
      );
      return;
    }

    if (startDate > endDate) {
      swal(
        "Start date cannot be after End Date",
        "Choose correct date",
        "info"
      );
      return;
    }

    if (startValue < createValue) {
      swal(
        "Event cannot be created on any past date!",
        "Select another date",
        "warning"
      );
      return;
    }

    const event = {
      userEmail,
      title,
      place,
      start,
      color,
      end,
      event_link: `${userName}/${event_link}`,
      description,
      createdOn,
    };

    try {
      const response = await fetch(
        `${EventBaseURL}/events/newevent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            UserEmail: userEmail,
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();

      if (result.Created) {
        swal(
          "Event Created!",
          "Your Event has been Scheduled.",
          "success"
        );

        setTimeout(() => {
          window.location.href = "/Dashboard.html";
        }, 2000);

      } else {
        swal(
          "Overlapping Event Found",
          `${result.OverlappingEvent.title}
Starts: ${result.OverlappingEvent.start}
Ends: ${result.OverlappingEvent.end}`,
          "warning"
        );
      }

    } catch (error) {
      swal("Server Error", error.message, "error");
    }
  }

  function handleLogout() {
    swal("Logging Out..", "", "info");

    localStorage.clear();

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  function handleCancel() {
    swal({
      title: "Cancel Creating Event?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(confirm => {
      if (confirm) {
        window.location.href = "/Dashboard.html";
      }
    });
  }

  return (
    <>
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

            <span>{userEmail.split("@")[0]}</span>
          </div>
        </div>
      </header>

      <div className="margins">
        <form onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Event Name"
            onChange={handleChange}
            required
          />

          <select
            name="place"
            onChange={handleChange}
            required
          >
            <option value="">Add location</option>
            <option value="Google-meet">
              Google Meet
            </option>
            <option value="Zoom-call">
              Zoom
            </option>
          </select>

          <input
            type="date"
            name="startDate"
            onChange={handleChange}
          />

          <input
            type="date"
            name="endDate"
            onChange={handleChange}
          />

          <input
            type="time"
            name="startTime"
            onChange={handleChange}
          />

          <input
            type="time"
            name="endTime"
            onChange={handleChange}
          />

          <input
            name="event_link"
            placeholder="Event link"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>

          <button type="submit">
            Create Event
          </button>

        </form>
      </div>
    </>
  );
}