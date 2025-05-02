import React from 'react';

const ContactDetails = ({contact, activeContact, isEditing, setIsEditing}) => {
  const {id, firstName, lastName, email, street, city, state, zip, phone } = contact;

  // Stop event propagation
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return(
    <>
      <div 
        className={`contact-details--container ${(activeContact === id && !isEditing) ? 'active' : ''}`} 
        key={id}
        onClick={handleClick}
      >
        <div className="contact-details--item-name">{firstName}  {lastName}</div>
        <div className="contact-details--item-email">{email}</div>
        <div className="contact-details--item-address">
          {street}<br />
          {city}, {state} {zip}
        </div>
        <div className="contact-details--item-phone">{phone}</div>
        <button 
          className="contact-details--button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          Edit Contact Details
        </button> 
      </div>
    </>
  );
}

export default ContactDetails;