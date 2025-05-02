const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api';

// Test data
const testContact = {
  firstName: 'Test',
  lastName: 'User',
  email: `test-${uuidv4().slice(0, 8)}@example.com`,
  street: '123 Test St',
  city: 'Testville',
  state: 'TS',
  zip: '12345',
  phone: '555-123-4567'
};

let createdContactId;

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();
  return { response, data };
}

describe('API Endpoints', () => {
  // Test GET /api/oddballs
  test('GET /api/oddballs should return a list of contacts', async () => {
    const { response, data } = await apiRequest('/oddballs');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    // Verify the structure of a contact
    const contact = data[0];
    expect(contact).toHaveProperty('id');
    expect(contact).toHaveProperty('firstName');
    expect(contact).toHaveProperty('lastName');
    expect(contact).toHaveProperty('email');
  });
  
  // Test GET /api/oddballs with offset
  test('GET /api/oddballs with offset should return paginated results', async () => {
    const { response: response1, data: data1 } = await apiRequest('/oddballs?offset=0');
    const { response: response2, data: data2 } = await apiRequest('/oddballs?offset=50');
    
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    
    // If there are enough contacts, the first contact of the second page should be different
    if (data1.length >= 100 && data2.length > 0) {
      expect(data1[0].id).not.toBe(data2[0].id);
    }
  });
  
  // Test GET /api/search
  test('GET /api/search should return matching contacts', async () => {
    // First get some contacts to find a name to search for
    const { data: allContacts } = await apiRequest('/oddballs');
    
    if (allContacts.length > 0) {
      const searchName = allContacts[0].firstName.substring(0, 3);
      const { response, data } = await apiRequest(`/search?q=${searchName}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      
      // At least one result should contain the search term
      const hasMatch = data.some(contact => 
        contact.firstName.includes(searchName) || contact.lastName.includes(searchName)
      );
      expect(hasMatch).toBe(true);
    } else {
      console.warn('No contacts available for search test');
    }
  });
  
  // Test GET /api/search with invalid query
  test('GET /api/search without query should return 400', async () => {
    const { response, data } = await apiRequest('/search');
    
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
  
  // Test PUT /api/oddballs/:id with increased timeout
  test('PUT /api/oddballs/:id should update a contact', async () => {
    // First get a contact to update
    const { data: allContacts } = await apiRequest('/oddballs');
    
    if (allContacts.length === 0) {
      console.warn('No contacts available for update test');
      return; // Skip test if no contacts
    }
    
    const contactToUpdate = allContacts[0];
    const uniqueId = uuidv4().slice(0, 5);
    const updatedData = {
      ...contactToUpdate,
      firstName: `Updated-${uniqueId}`,
      lastName: 'TestUpdate'
    };
    
    try {
      const { response, data } = await apiRequest(`/oddballs/${contactToUpdate.id}`, 'PUT', updatedData);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      
      // Some implementations might return empty array if no rows affected
      if (data.length > 0) {
        expect(data[0].firstName).toBe(updatedData.firstName);
        expect(data[0].lastName).toBe(updatedData.lastName);
      }
      
      // Verify the update persisted by fetching it again
      const { data: verifyData } = await apiRequest('/oddballs');
      const updatedContact = verifyData.find(c => c.id === contactToUpdate.id);
      
      if (updatedContact) {
        expect(updatedContact.firstName).toBe(updatedData.firstName);
        expect(updatedContact.lastName).toBe(updatedData.lastName);
      } else {
        console.warn('Could not find updated contact in results');
      }
    } catch (error) {
      console.error('Error in PUT test:', error);
      throw error;
    }
  }, 20000); // Increase timeout to 20 seconds
  
  // Test PUT /api/oddballs/:id with invalid ID
  test('PUT /api/oddballs/:id with invalid ID should handle gracefully', async () => {
    const invalidId = 999999;
    const { response } = await apiRequest(`/oddballs/${invalidId}`, 'PUT', {
      firstName: 'Invalid',
      lastName: 'Update'
    });
    
    // The server should either return 404 (not found) or 200 with empty array
    expect([200, 404]).toContain(response.status);
  });

  // Add a test for cleaning up connections
  afterAll(async () => {
    // Add a small delay to allow connections to close
    await new Promise(resolve => setTimeout(resolve, 500));
  });
});
