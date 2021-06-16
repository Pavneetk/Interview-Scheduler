import { useState, useEffect } from "react";
import axios from 'axios';


export default function useApplicationData(initial) {
const [state, setState] = useState({
  day: "Monday",
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
    updateSpots();
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


const  updateSpots = async() => {
  let dayId = 1;
  let countStart = 1;
  let spots = 0;
  switch(state.day) {
    case "Monday": dayId = 0; break;
    case "Tuesday": dayId = 1; countStart=6; break;
    case "Wednesday": dayId = 2; countStart=11; break;
    case "Thursday": dayId = 3; countStart =16;break;
    case "Friday": dayId = 4; countStart=21; break;
    default: dayId = 0; countStart=1;
  }

  let appointments = await axios.get('/api/appointments');
  
    for (let i = countStart; i < (countStart+5); i++) {
    if(!appointments.data[i.toString()].interview || !appointments.data[i.toString()].interview.interviewer) {
      spots++
    }
  }
  const dayUpdate = {
    ...state.days[dayId],
    spots: spots,
  } 
  const days = [...state.days];
  days[dayId] = dayUpdate;
  
  setState(prev => ({ ...prev, days }));
  
  
}


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