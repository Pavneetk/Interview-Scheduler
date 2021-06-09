import React from "react";
import "components/InterviewerListItem.scss";
import classnames from 'classnames'

export default function InterviewerListItem(props) {

  const interviewerItemlistClass = classnames("interviewers__item", {"interviewers__item--selected": props.selected})

  return (
    <li className={interviewerItemlistClass} key={props.id} onClick={() => props.setInterviewer(props.name)}>
      <img
        className={interviewerItemlistClass+"-image"}
        src={props.avatar}
        alt={props.name}
      />
       {props.name}
    </li>
  );
}
