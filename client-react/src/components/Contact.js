import React, { useState, useEffect, useRef } from 'react';
import ContactDetails from './ContactDetails';
import EditContactDetails from './EditContactDetails';

const Contact = ({contact, activeContact, setActiveContact, isEditing, setIsEditing}) => {
  const {id, firstName, lastName, email} = contact;
  const firstInit = firstName.charAt(0);
  const isActive = activeContact === id;
  const [showEditMode, setShowEditMode] = useState(isEditing);
  const containerRef = useRef(null);
  
  // Update showEditMode when isEditing changes
  useEffect(() => {
    // Small delay to allow animation to complete
    const timer = setTimeout(() => {
      setShowEditMode(isEditing);
    }, 50);
    return () => clearTimeout(timer);
  }, [isEditing]);
  
  // Generate a random pastel color for the background
  const getRandomColor = () => {
    // Using pastel colors for better readability
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  // Generate color once when component mounts
  const bgColor = React.useMemo(() => getRandomColor(), []);

  const handleClick = () => {
    isActive ? setActiveContact(null) : setActiveContact(id);
    if (isEditing) setIsEditing(false);
  };

  // Render the appropriate component based on edit mode
  const renderContent = () => {
    if (showEditMode) {
      return (
        <EditContactDetails 
          contact={contact} 
          activeContact={activeContact}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      );
    } else {
      return (
        <ContactDetails 
          contact={contact} 
          activeContact={activeContact}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      );
    }
  };

  return(
    <>
      <li className="contact-list--item" onClick={handleClick}>
        <span 
          className="contact-list--initial" 
          style={{ backgroundColor: bgColor }}
        >
          {firstInit}
        </span> 
        <div>
          <span className="contact-list--name">{firstName} {lastName}</span>
          <br />{email}
          
          <div 
            className={`slide-container ${isActive ? 'active' : ''}`}
            ref={containerRef}
          >
            {isActive && renderContent()}
          </div>
        </div>
        {/* Arrow indicator */}
        <span className={`contact-list--arrow ${isActive ? 'active' : ''}`}>
          &#9654;
        </span>
      </li>
    </>
  );
}

export default Contact;
