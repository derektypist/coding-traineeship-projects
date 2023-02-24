import React from "react";

import { ContactPicker } from "../../components/contactPicker/ContactPicker";

export const AppointmentForm = ({
  contacts,
  title,
  setTitle,
  contact,
  setContact,
  date,
  setDate,
  time,
  setTime,
  handleSubmit,
  alert,
  defaultListValue,
}) => {
  const getTodayString = () => {
    const [month, day, year] = new Date()
      .toLocaleDateString("en-US")
      .split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const getContactNames = () => {
    return contacts.map((contact) => contact.name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="titleInput">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        id="titleInput"
        required
      />
      <ContactPicker
        name="contact"
        value={contact}
        contacts={getContactNames()}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Appointment With"
      />
      <label htmlFor="dateInput">Date</label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="text"
        id="dateInput"
        min={getTodayString()}
        required
      />
      <label htmlFor="timeInput">Time</label>
      <input
        value={time}
        onChange={(e) => setTime(e.target.value)}
        type="text"
        id="timeInput"
        required
      />
      <button type="submit" disabled={alert ? true : false}>
        Add Appointment
      </button>
      <h2 className="alert">{alert}</h2>
    </form>
  );
};
