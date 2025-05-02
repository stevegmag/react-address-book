import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [contacts, setContacts]= useState([])
  const [activeContact, setActiveContact]= useState(null)
  const [isEditing, setIsEditing]= useState(false)

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

const ContactList = ({contacts, activeContact, setActiveContact, isEditing, setIsEditing}) => {
  console.log(contacts[0]);
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
            key={contact.id} 
          />
        ))}
      </ul>
    </section>
  );
}

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
        onClick={handleClick}  // Add click handler to stop propagation
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
            e.stopPropagation();  // Extra protection for the button
            setIsEditing(true);
          }}
        >
          Edit Contact Details
        </button> 
      </div>
    </>
  );
}
const EditContactDetails = ({contact, activeContact, isEditing, setIsEditing}) => {
  const {id, firstName: initialFirstName, lastName: initialLastName, email: initialEmail, 
         street: initialStreet, city: initialCity, state: initialState, 
         zip: initialZip, phone: initialPhone } = contact;
  
  // State for form fields
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [street, setStreet] = useState(initialStreet);
  const [city, setCity] = useState(initialCity);
  const [state, setState] = useState(initialState);
  const [zip, setZip] = useState(initialZip);
  const [phone, setPhone] = useState(initialPhone);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Stop event propagation
  const handleClick = (e) => {
    e.stopPropagation();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();  // Stop propagation here too
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`api/oddballs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          street,
          city,
          state,
          zip,
          phone
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      
      // Update was successful
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return(
    <>
      <div 
        className={`contact-details--container ${(activeContact === id && isEditing) ? 'active' : ''}`} 
        key={id}
        onClick={handleClick}  // Add click handler to stop propagation
      >
        <form onSubmit={handleSubmit}>
          <div className="contact-details--form-group">
            <label>First Name:</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>Last Name:</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>Street:</label>
            <input 
              type="text" 
              value={street} 
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>City:</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>State:</label>
            <input 
              type="text" 
              value={state} 
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>Zip:</label>
            <input 
              type="text" 
              value={zip} 
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
          
          <div className="contact-details--form-group">
            <label>Phone:</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="contact-details--buttons">
            <button 
              type="button" 
              className="contact-details--button secondary" 
              onClick={(e) => {
                e.stopPropagation();  // Stop propagation
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              Cancel Changes
            </button>
            <button 
              type="submit" 
              className="contact-details--button" 
              disabled={isSaving}
              onClick={(e) => e.stopPropagation()}  // Stop propagation
            >
              {isSaving ? 'Saving...' : 'Save Contact Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
