import React, { useState } from 'react';

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
    e.stopPropagation();
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`api/oddballs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName, lastName, email, street, city, state, zip, phone
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      
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
        onClick={handleClick}
      >
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="contact-details--form-group">
            <label>First Name:</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          {/* Other form fields... */}
          <div className="contact-details--form-group">
            <label>Last Name:</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          
          <div className="contact-details--form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="contact-details--form-group">
            <label>Street:</label>
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          
          <div className="contact-details--form-group">
            <label>City:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          
          <div className="contact-details--form-group">
            <label>State:</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          
          <div className="contact-details--form-group">
            <label>Zip:</label>
            <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          
          <div className="contact-details--form-group">
            <label>Phone:</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="contact-details--buttons">
            <button 
              type="button" 
              className="contact-details--button secondary" 
              onClick={(e) => {
                e.stopPropagation();
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
              onClick={(e) => e.stopPropagation()}
            >
              {isSaving ? 'Saving...' : 'Save Contact Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditContactDetails;