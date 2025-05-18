import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserShield, FaSignInAlt } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function MyJoinedGroup() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userID');
  const navigate = useNavigate();
