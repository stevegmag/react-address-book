import React, { useState, useEffect } from 'react';
import './App.css';
import ContactList from './components/ContactList';

const App = () => {
  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetch('api/oddballs').then(resp => resp.json()).then(data => {
      // console.log(data)
      setContacts(data)
    })
  }, [])

  return (
    <div className="App">
        <input
          type="text"
          name="search"
          onChange={e => console.log(e.target.value)}
        />
        <ContactList 
          contacts={contacts} 
          activeContact={activeContact} 
          setActiveContact={setActiveContact}
          isEditing={isEditing}
          setIsEditing={setIsEditing} 
        />
    </div>
  );
}

export default App;
