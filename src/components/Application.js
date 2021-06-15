import React from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import "components/Appointment"
import Appointment from "components/Appointment";

import {getAppointmentsForDay, getInterview, getInterviewersForDay} from 'helpers/selectors'
import useApplicationData from '../hooks/useApplicationData'

/*
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
];*/

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    
  } = useApplicationData();
  

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  
  let mappedAppointments = dailyAppointments.map((appointment)=>{
    
    const interview = getInterview(state, appointment.interview);
    return <Appointment key={appointment.id} id={appointment.id} time={appointment.time} interview={interview} interviewers={dailyInterviewers} bookInterview={bookInterview} cancelInterview={cancelInterview}/>
  })

  mappedAppointments.push(<Appointment key="last" time="5pm" />);
  
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
