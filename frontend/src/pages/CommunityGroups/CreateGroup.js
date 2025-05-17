import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
function CreateGroup() {
  const [formData, setFormData] = useState({
    groupTitle: '',
    groupDescription: '',
    adminID: '',
    adminName: ''
  });

  useEffect(() => {
    // Fetch adminID from localStorage
    const userID = localStorage.getItem('userID');
    if (userID) {
      // Fetch adminName from backend
      fetch(`http://localhost:8080/user/${userID}/fullname`)
        .then(res => res.json())
        .then(data => {
          setFormData(prev => ({
            ...prev,
            adminID: userID,
            adminName: data.fullName || ''
          }));
        })
        .catch(() => {
          setFormData(prev => ({
            ...prev,
            adminID: userID,
            adminName: ''
          }));
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
