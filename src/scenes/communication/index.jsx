import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Communication = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploaded_by, setUploaded_by] = useState('');
  


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please login.");
      }

      // Create a new JSON object with all form data
      const CommunicationData = {
        title,
        content,
        uploaded_by,
      };

      // Make the API call
      const response = await fetch('/admin/addAnnouncement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(CommunicationData)
      });

      // Handle the response
      const data = await response.json();
      if (response.ok) {
        console.log('Registration Successful:', data);
        // You can navigate or display a success message
      } else {
        console.error('Registration Error:', data);
        // Handle error responses
      }
    } catch (error) {
      console.error('API Call Failed:', error);
      // Handle network or other errors
    }
  };

  return (
    <>
      <h2>Communication Center</h2>
      <Form onSubmit={handleFormSubmit}>
      {/* --------------------------------------- */}
      <div className="row mb-3">
          <div className="col">
            <input type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} className="form-control" aria-label="Title"/>
          </div>
        </div>

        <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
        <textarea placeholder="Enter Communication Details"
            value={content}
            onChange={(e) => setContent(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>

        <div className="row mb-3">
          {/* <div className="col">
            <input type="text"
            placeholder="Enter Communication Details"
            value={content}
            onChange={(e) => setContent(e.target.value)} className="form-control" aria-label="Enter Communication Details"
            />
          </div> */}
          <div className="col">
            <input type="text"
            placeholder="Uploaded By"
            value={uploaded_by}
            onChange={(e) => setUploaded_by(e.target.value)}className="form-control" aria-label="Uploaded By"/>
          </div>
        </div>
        <Button type="submit" className="btn btn-primary">
          Add Announcement
        </Button>
      </Form>
    </>
  );
};

export default Communication;