import React from 'react';
import ContactDetails from './ContactDetails';
import EditContactDetails from './EditContactDetails';

const Contact = ({contact, activeContact, setActiveContact, isEditing, setIsEditing}) => {
  const {id, firstName, lastName, email} = contact;
  const firstInit = firstName.charAt(0);
  
  // Generate a random pastel color for the background
  const getRandomColor = () => {
    // Using pastel colors for better readability
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  // Generate color once when component mounts
  const bgColor = React.useMemo(() => getRandomColor(), []);

  return(
    <>
      <li className="contact-list--item" key={id} 
        onClick={() => {
          (activeContact === id) ? setActiveContact(null) : setActiveContact(id); 
          isEditing ? setIsEditing(false) : null
        }
      }>
        <span 
          className="contact-list--initial" 
          style={{ backgroundColor: bgColor }}
        >
          {firstInit}
        </span> 
        <div>
          <span className="contact-list--name">{firstName} {lastName}</span>
          <br />{email}
          {isEditing ? (
            <EditContactDetails 
              contact={contact} 
              activeContact={activeContact}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ) : (
            <ContactDetails 
              contact={contact} 
              activeContact={activeContact}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </li>
    </>
  );
}

export default Contact;