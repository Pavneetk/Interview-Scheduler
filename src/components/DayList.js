import React from "react";
import DayListItem from "components/DayListItem";
import "components/DayList.scss";

export default function DayList(props) {
  let days = props.days.map((day) => {
    return <DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={() => { props.setDay(day.name); }} />
  })

  return <>{days}</>;
}
