import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ContactList from './components/ContactList';

const App = () => {
  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshContacts = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetch('/api/oddballs').then(resp => resp.json()).then(data => {
      setContacts(data)
    })
  }, [refreshTrigger])

  // When editing is done, refresh contacts
  useEffect(() => {
    if (!isEditing && refreshTrigger > 0) {
      fetch('/api/oddballs').then(resp => resp.json()).then(data => {
        setContacts(data)
      })
    }
  }, [isEditing, refreshTrigger]);

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
          refreshContacts={refreshContacts}
        />
    </div>
  );
}

export default App;
