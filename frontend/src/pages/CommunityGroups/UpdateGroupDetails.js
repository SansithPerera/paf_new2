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
  