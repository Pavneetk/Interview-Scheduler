import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import "components/Appointment"
import Appointment from "components/Appointment";
import axios from 'axios';


const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Rand Al Thor",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Bart Simpson",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 5,
    time: "6pm",
    interview: {
      student: "Peter Griffin",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: "last",
    time: "7pm",
  }
];

export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Tuesday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
   // appointments: {}
  });
  
  let mappedAppointments = appointments.map((appointment)=>{
    return <Appointment key={appointment.id} {...appointment}/>
  })
  
  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));
  
  useEffect(() => {
    axios.get('/api/days')
    .then(res => {
      setDays(res.data);
    })
    .catch(err => console.log("err:",err));
  }, [])
 


  return (
    <main className="layout">
      <section className="sidebar">
      <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList days={state.days} day={state.day} setDay={setDay} />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {mappedAppointments}
      </section>
    </main>
  );
}
