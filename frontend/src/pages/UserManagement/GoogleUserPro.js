import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTools, FaEdit } from 'react-icons/fa';
import './UserProfile.css'
import Pro from './img/img.png';
import Layout from '../../Components/Layout/Layout';

export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user details');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

function GoogalUserPro() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID');
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            fetchUserDetails(userId).then((data) => setUserData(data));
        }
    }, []);

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        if (storedUserType === 'google') {
            const googleImage = localStorage.getItem('googleProfileImage');
            setGoogleProfileImage(googleImage);
        } else if (userId) {
            fetchUserDetails(userId).then((data) => {
                if (data && data.profilePicturePath) {
                    setUserProfileImage(`http://localhost:8080/uploads/profile/${data.profilePicturePath}`);
                }
            });
        }
    }, [userId]);

     const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            const userId = localStorage.getItem('userID');
            fetch(`http://localhost:8080/user/${userId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem('userID');
                        navigate('/'); // Redirect to home or login page
                    } else {
                        alert("Failed to delete profile.");
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    const navigateToUpdate = () => {
        navigate(`/updateProfile/${userId}`);
    };

    return (
        <Layout>
            <div className="profile-layout" style={{ 
                maxWidth: '1200px',
                margin: '20px auto',
                padding: '0 15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}>
                <div className="profile-sidebar" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px',
                    marginTop: '5rem',
                }}>
                    {userData && userData.id === localStorage.getItem('userID') && (
                        <>
                            <div className="profile-header-section">
                                <img
                                    src={
                                        googleProfileImage
                                            ? googleProfileImage
                                            : userProfileImage
                                                ? userProfileImage
                                                : Pro
                                    }
                                    alt="Profile"
                                    className="profile-avatar"
                                    style={{ 
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        border: '3px solid #FF6F61'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = Pro;
                                    }}
                                />
                                <h2 className="profile-name" style={{ color: '#333', marginTop: '15px' }}>{userData.fullname}</h2>
                                <span className="profile-role" style={{ color: '#FF6F61' }}>User</span>
                            </div>
                            
                            <div className="profile-quick-stats">
                                <div className="stat-box" style={{ 
                                    backgroundColor: 'rgba(255, 111, 97, 0.1)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s'
                                }}>
                                    <span className="stat-number" style={{ color: '#FF6F61', fontWeight: 'bold' }}>12</span>
                                    <span className="stat-label" style={{ color: '#555' }}>Posts</span>
                                </div>
                                <div className="stat-box" style={{ 
                                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s'
                                }}>
                                    <span className="stat-number" style={{ color: '#4285F4', fontWeight: 'bold' }}>5</span>
                                    <span className="stat-label" style={{ color: '#555' }}>Skills</span>
                                </div>
                                <div className="stat-box" style={{ 
                                    backgroundColor: 'rgba(219, 112, 147, 0.1)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s'
                                }}>
                                    <span className="stat-number" style={{ color: '#DB7093', fontWeight: 'bold' }}>3</span>
                                    <span className="stat-label" style={{ color: '#555' }}>Awards</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>