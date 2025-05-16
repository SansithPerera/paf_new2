import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import GoogalLogo from './img/glogo.png';
import { IoMdAdd } from "react-icons/io";
import './UserRegister.css';

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
        bio: '', // Added bio field
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State for previewing the selected image
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [userEnteredCode, setUserEnteredCode] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

     const triggerFileInput = () => {
        document.getElementById('profilePictureInput').click();
    };

    const sendVerificationCode = async (email) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('verificationCode', code);
        try {
            await fetch('http://localhost:8080/sendVerificationCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData.email) {
            alert("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Email is invalid");
            isValid = false;
        }

        if (!profilePicture) {
            alert("Profile picture is required");
            isValid = false;
        }
        if (formData.skills.length < 2) {
            alert("Please add at least two skills.");
            isValid = false;
        }
        if (!isValid) {
            return; // Stop execution if validation fails
        }

        try {
            // Step 1: Create the user
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    skills: formData.skills,
                    bio: formData.bio, // Include bio in the request
                }),
            });

            if (response.ok) {
                const userId = (await response.json()).id; // Get the user ID from the response

                
                // Step 2: Upload the profile picture
                if (profilePicture) {
                    const profileFormData = new FormData();
                    profileFormData.append('file', profilePicture);
                    await fetch(`http://localhost:8080/user/${userId}/uploadProfilePicture`, {
                        method: 'PUT',
                        body: profileFormData,
                    });
                }

                sendVerificationCode(formData.email); // Send verification code
                setIsVerificationModalOpen(true); // Open verification modal
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = () => {
        const savedCode = localStorage.getItem('verificationCode');
        if (userEnteredCode === savedCode) {
            alert('Verification successful!');
            localStorage.removeItem('verificationCode');
            window.location.href = '/';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-content-wrapper">
                <div className="register-form-container">
                    <h1 className="register-form-title">Create your account</h1>
                    
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="profile-upload">
                            <div className="profile-preview" onClick={triggerFileInput}>
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <FaUserCircle size={64} color="#6366f1" />
                                )}
                            </div>
                            <input
                                id="profilePictureInput"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    name="fullname"
                                    placeholder="Enter your full name"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

