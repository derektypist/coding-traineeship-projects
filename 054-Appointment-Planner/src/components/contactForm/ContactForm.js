import React from "react";

export const ContactForm = ({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  handleSubmit,
  alert
}) => {
  return (
   <form onSubmit={handleSubmit}>
    <label htmlFor="nameInput">Name</label>
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
      type="text"
      id="nameInput"
      required />
    <label htmlFor="phoneInput">Phone</label>
    <input
      value={phone}
      onChange={(e) => setPhone(e.target.value)} 
      type="tel"
      pattern="^\s*\(?(020[7,8]{1}\)?[ ]?[1-9]{1}[0-9{2}[ ]?[0-9]{4})|(0[1-8]{1}[0-9]{3}\)?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{3})\s*$"
      id="phoneInput"
      required />
    <label htmlFor="emailInput">Email</label>
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="email"
      id="emailInput"
      required
    />
    <button type="submit" disabled={alert ? true:false}>Add Contact</button>
    <h2 className="alert">{alert}</h2>
   </form>
  );
};