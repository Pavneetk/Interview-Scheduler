export function getAppointmentsForDay(state, day) {
  let dayPicked = day;
  let dayPickedData = state.days.filter(day => day.name === dayPicked);
  if (dayPickedData[0] === undefined) return [];
  let allAppointmentsKeys = Object.keys(state.appointments);
  let appointmentsForDay = dayPickedData[0].appointments;
  let appointmentsData = [];
  
  

  allAppointmentsKeys.forEach(key => {
    if (appointmentsForDay.includes(Number(key))) {
       appointmentsData.push(state.appointments[key]);
      }
  });
    
  
  
  return appointmentsData;
}

export function getInterview(state, interview) {
  if(interview === null ) return null;
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer.toString()]
  };
}

