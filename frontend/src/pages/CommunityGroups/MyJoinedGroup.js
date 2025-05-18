import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserShield, FaSignInAlt } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function MyJoinedGroup() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userID');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/communications')
      .then((response) => response.json())
      .then((data) => {
        // Filter groups where userId is in groupMembersIDs or adminID === userId
        const joinedGroups = data.filter(
          (group) =>
            (Array.isArray(group.groupMembersIDs) &&
              group.groupMembersIDs.includes(userId)) ||
            group.adminID === userId
        );
        setGroups(joinedGroups);
      })
      .catch((error) => console.error('Error fetching group data:', error));
  }, [userId]);
