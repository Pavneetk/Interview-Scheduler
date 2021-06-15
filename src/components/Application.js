import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import "components/Appointment"
import Appointment from "components/Appointment";
import axios from 'axios';
import {getAppointmentsForDay, getInterview, getInterviewersForDay} from 'helpers/selectors'

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
  
  const [state, setState] = useState({
    day: "Tuesday",
    days: [],
    appointments: [],
    interviewers: {}
  });
  
   let bookInterview = async (id, interview) => {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });

    let response = await Promise.all([axios.put(`/api/appointments/${id}`, {interview})])
    .then((all)=>{
      return true;
      })
      .catch(function (error) {
      console.log(error);
      return false;
    });
    
    return response;
  };

  const cancelInterview = async (id) => {
    const interview = null;
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
    console.log(appointments)
    
    let response = await axios.put(`/api/appointments/${id}`, {
      "interview": {
        "student": "",
        "interviewer": null
      }
    })
    .then((all)=>{
      return true;
      })
      .catch(function (error) {
      console.log(error);
      return false;
    });
    
    return response;
  };

  const setDay = day => setState({ ...state, day });
 // const setDays = days => setState(prev => ({ ...prev, days }));
  
  useEffect(() => {
   Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
   ]).then((all) => {
     setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
     
   })
    .catch(err => console.log("err:",err));
  }, [])

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
