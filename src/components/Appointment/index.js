import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";

 
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  async function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    let response = await props.bookInterview(props.id, interview);
      if(response) {
      transition(SHOW); };
      
    
  }
  return (
  <article className="appointment">
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (<Show student={props.interview.student} interviewer={props.interview.interviewer}/>)}
    {mode === CREATE && (<Form interviewers={props.interviewers} onCancel={() => {back()}} onSave={(name,interviewer) => {save(name,interviewer)}}/>)}
    {mode === SAVING && <Status/>}
  </article>
  );
}