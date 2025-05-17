import React, { useEffect, useState } from 'react';
import './group.css'
import { FaEdit, FaTrash, FaUserCog } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
function MyGroup() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userID');
  
  useEffect(() => {
    fetch('http://localhost:8080/communications')
      .then((response) => response.json())
      .then((data) => setGroups(data))
      .catch((error) => console.error('Error fetching group data:', error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const response = await fetch(`http://localhost:8080/communications/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Group deleted successfully!');
          setGroups(groups.filter((group) => group.id !== id));
        } else {
          alert('Failed to delete group.');
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };
