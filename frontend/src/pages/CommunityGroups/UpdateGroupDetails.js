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