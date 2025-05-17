import React, { useEffect, useState } from 'react';
import './group.css'
import { FaEdit, FaTrash, FaUserCog } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
function MyGroup() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userID');
