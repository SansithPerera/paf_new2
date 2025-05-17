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

   useEffect(() => {
    // Fetch the post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || ''); // Ensure title is not undefined
        setDescription(post.description || ''); // Ensure description is not undefined
        setCategory(post.category || ''); // Set category
        setExistingMedia(post.media || []); // Ensure media is an array
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl)); // Remove from UI
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    const previews = files.map(file => ({
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    setMediaPreviews(previews);
    setNewMedia(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleNewMediaChange({ target: { files } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category); // Include category in the update
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-spinner">Loading...</div>
      </Layout>
    );
  }