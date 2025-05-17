import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../Components/Layout/Layout';
import './AddNewPost.css';  // Add this import to use same styles

function UpdatePost() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [existingMedia, setExistingMedia] = useState([]); // Initialize as an empty array
  const [newMedia, setNewMedia] = useState([]); // New media files to upload
  const [loading, setLoading] = useState(true); // Add loading state
  const [showMediaUploadInput, setShowMediaUploadInput] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);