import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error"


 
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = 'CONFIRM';
const DELETE = 'DELETE';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE'


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  async function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING,true);

    let response = await props.bookInterview(props.id, interview);
      if(response === true) {
        transition(SHOW);
      
      
      } else if (!response) {
        transition(ERROR_SAVE, true);
      }
      
  }

  function confirmDelete() {
    transition(CONFIRM);
  }

  async function delInt() {
    transition(DELETE,true);
    let response = await props.cancelInterview(props.id);
    if(response) {
      transition(EMPTY);
      
    } else if (!response) {
      transition(ERROR_DELETE, true);
    };
    
  }

  async function editInt() {
    transition(EDIT);
  }

  return (
  <article className="appointment" data-testid="appointment">
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (<Show student={props.interview.student} interviewer={props.interview.interviewer} onDelete={confirmDelete} onEdit={editInt}/>)}
    {mode === CREATE && (<Form interviewers={props.interviewers} onCancel={() => {back()}} onSave={(name,interviewer) => {save(name,interviewer)}}/>)}
    {mode === EDIT && (<Form interviewers={props.interviewers} name={props.interview.student} interviewer={props.interview.interviewer.id} onCancel={() => {back()}} onSave={(name,interviewer) => {save(name,interviewer)}}/>)}
    {mode === SAVING && <Status message='Saving'/>}
    {mode === DELETE && <Status message='Deleting'/>}
    {mode === CONFIRM && <Confirm message='Are you sure you would like to Delete?' onConfirm={delInt} onCancel={() => {back()}}/>}
    {mode === ERROR_SAVE && <Error message='Error Saving Interview' onClose={()=>{back()}}/>}
    {mode === ERROR_DELETE && <Error message='Error Deleting Interview' onClose={()=>{back()}}/>}
  </article>
  );
}