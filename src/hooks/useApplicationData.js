import { useState, useEffect } from "react";
import axios from 'axios';


export default function useApplicationData(initial) {
const [state, setState] = useState({
  day: "Tuesday",
  days: [],
  appointments: [],
  interviewers: {}
});

 let bookInterview = async (id, interview) => {
  
  let response = await Promise.all([axios.put(`/api/appointments/${id}`, {interview})])
  .then((all)=>{
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
    return true;
    })
    .catch(function (error) {
    console.log(error);
    return false;
  });
  
  return response;
};

const cancelInterview = async (id) => {

  let response = await axios.put(`/api/appointments/${id}`, {
    "interview": {
      "student": "",
      "interviewer": null
    }
  })
  .then((all)=>{
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

return {state, setDay, bookInterview, cancelInterview};
}