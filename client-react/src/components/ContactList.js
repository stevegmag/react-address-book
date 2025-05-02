import React from 'react';
import Contact from './Contact';

const ContactList = ({contacts, activeContact, setActiveContact, isEditing, setIsEditing, refreshContacts}) => {
  if(!contacts) {
    return (
      <div className="empty-contacts">no contacts found</div>
    );
  }

  return (
    <section className="contact-list--section">
      <ul className="contact-list--list">
        {contacts.map(contact => (
          <Contact 
            contact={contact} 
            activeContact={activeContact} 
            setActiveContact={setActiveContact}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            refreshContacts={refreshContacts}
            key={contact.id} 
          />
        ))}
      </ul>
    </section>
  );
}

export default ContactList;
