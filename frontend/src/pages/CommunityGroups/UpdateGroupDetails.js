import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

function UpdateGroupDetails() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    groupTitle: '',
    groupDescription: '',
    adminID: '',
    adminName: ''
  });

    useEffect(() => {
    fetch(`http://localhost:8080/communications/${id}`)
      .then((response) => response.json())
      .then((data) => setFormData(data))
      .catch((error) => console.error('Error fetching group data:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/communications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Group updated successfully!');
        window.location.href = '/myGroup';
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      alert(error.message || 'An error occurred.');
    }
  };
