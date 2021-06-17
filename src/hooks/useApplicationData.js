import { useState, useEffect } from "react";
import axios from 'axios';


export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: {}
  });

  let bookInterview = async (id, interview) => {
    //put to server api setting intview details for appointment id
    let response = await Promise.all([axios.put(`/api/appointments/${id}`, { interview })])
      .then(() => {
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
        updateSpots();
        return true;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
    return response;
  };

  const cancelInterview = async (id) => {
    //put to api server setting student to blank and inteviewer to null for current appointment time
    let response = await axios.put(`/api/appointments/${id}`, {
      "interview": {
        "student": "",
        "interviewer": null
      }
    })
      .then(() => {
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
        updateSpots();
        return true;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });

    return response;
  };

  const setDay = (day) => { setState({ ...state, day }); updateSpots(); }

  const updateSpots = async () => {
   //variable declaration
    let dayId = 0;
    let countStart = 1;
    let spots = 0;
    //based on the state of the day, set the dayId, and where to start going through the appointments
    switch (state.day) {
      case "Monday": dayId = 0; break;
      case "Tuesday": dayId = 1; countStart = 3; break;
      case "Wednesday": dayId = 2; countStart = 11; break;
      case "Thursday": dayId = 3; countStart = 16; break;
      case "Friday": dayId = 4; countStart = 21; break;
      default: dayId = 0; countStart = 1;
    }
    //retrieves full list of appointments
    let appointments = await axios.get('/api/appointments');
    //go through the relevant appointments and convert the index into a string, if the interview or interviewer is null then count that as an available spot
    for (let i = countStart; i < (countStart + 5); i++) {
      if (!appointments.data[i.toString()].interview || !appointments.data[i.toString()].interview.interviewer) {
        spots++
      }
    }
    //update state only, currently there is no way to axios put spots update to serverapi, so on page refresh spots values reset to the server values, 
    //however changing days will update to correct spots value
    const dayUpdate = {
      ...state.days[dayId],
      spots: spots,
    }
    const days = [...state.days];
    days[dayId] = dayUpdate;
    setState(prev => ({ ...prev, days }));
    return true;
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
      .catch(err => console.log("err:", err));
  }, [])

  return { state, setDay, bookInterview, cancelInterview };
}