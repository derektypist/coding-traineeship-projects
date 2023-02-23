import React, { useState, useEffect } from "react";

import { AppointmentForm } from "../../components/appointmentForm/AppointmentForm";
import { TileList } from "../../components/tileList/TileList";

export const AppointmentsPage = (props) => {
  /*
  Define state variables for 
  appointment info
  */
  const [currentTitle,setCurrentTitle] = useState('');
  const [currentContact,setCurrentContact] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [alert, setAlert] = useState('');
  const defaultListValue = 'No contact selected';


  const handleSubmit = (e) => {
    e.preventDefault();
    /*
    Add contact info and clear data  
    */

    props.addAppointment(currentTitle, currentContact, currentDate, currentTime);
    setCurrentTitle('');
    setCurrentContact('');
    setCurrentDate('');
    setCurrentTime('');
    document.getElementById('contactList').value = defaultListValue;
   
  };

  useEffect(() => {
    for (const appointmentItem of props.appointments) {
      if (appointmentItem.date === currentDate && appointmentItem.time === currentTime) {
        setAlert('Appointment is already booked.');
        console.log('Appointment is already booked.');
      } else {
        setAlert('');
      }
    }
  }, [props.appointments, currentDate, currentTime]);

  return (
    <div>
      <section>
        <h2>Add Appointment</h2>
        <AppointmentForm contacts={props.contacts}
        title={currentTitle}
        setTitle={setCurrentTitle}
        contact={currentContact}
        setContact={setCurrentContact}
        date={currentDate}
        setDate={setCurrentDate}
        time={currentTime}
        setTime={setCurrentTime}
        handleSubmit={handleSubmit}
        alert={alert}
        defaultListValue={defaultListValue}/>
      </section>
      <hr />
      <section>
        <h2>Appointments</h2>
        <TileList object={props.appointments} />
      </section>
    </div>
  );
};
