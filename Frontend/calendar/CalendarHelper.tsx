import { useState } from "react";
import { DateHelper } from "./DateHelper";

export function useCalendar() {
  const [referenceDate, setReferenceDate] = useState(new Date());

  const { year, month, week: rawWeek } = DateHelper.getDateIndex(referenceDate);

  //Logic for going back and forth between dates
  const changeWeek = (delta: number) => {
    setReferenceDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + delta * 7);
      return newDate;
    });
  };

  //Jump to the given date
  const jumpToDate = (date: Date) => {
    setReferenceDate(date);
  }

  return { 
    week: rawWeek + 1, // Shift 0-51 to 1-52
    month, 
    year, 
    changeWeek,
    jumpToDate
  };
}

export function getEventPosition(startTime: string, endTime: string, startHour: number, endHour: number) {
  const [ startH, startM ] = startTime.split(":").map(Number);
  const [ endH, endM ] = endTime.split(":").map(Number);

  const totalHours = endHour - startHour;
  const startDecimal = startH + startM / 60 - startHour;
  const endDecimal = endH + endM / 60 - startHour;

  const top = (startDecimal / totalHours) * 100;
  const height = ((endDecimal - startDecimal) / totalHours) * 100;

  return { top: `calc(${top}% + 40px)`, height: `${height}%` }
}

