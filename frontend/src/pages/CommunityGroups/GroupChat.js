import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import { FaTrash, FaEdit, FaSave, FaTimes, FaPaperPlane, FaImage } from 'react-icons/fa';

function GroupChat() {
    const { id: groupId } = useParams();
    const userId = localStorage.getItem('userID');
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const [userNames, setUserNames] = useState({});
    const [groupTitle, setGroupTitle] = useState('');
    const [editMsgId, setEditMsgId] = useState(null);
    const [editMsgValue, setEditMsgValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch group info
    useEffect(() => {
        fetch(`http://localhost:8080/communications/${groupId}`)
            .then(res => res.json())
            .then(data => setGroupTitle(data.groupTitle || ''));
    }, [groupId]);

    // Fetch messages for this group
    const fetchMessages = () => {
        fetch(`http://localhost:8080/groupChat/${groupId}/messages`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
                // Fetch all unique user fullnames
                const userIds = [...new Set(data.map(m => m.userId))];
                Promise.all(
                    userIds.map(uid =>
                        fetch(`http://localhost:8080/user/${uid}/fullname`)
                            .then(res => res.json())
                            .then(res => ({ uid, fullName: res.fullName }))
                    )
                ).then(results => {
                    const nameMap = {};
                    results.forEach(({ uid, fullName }) => {
                        nameMap[uid] = fullName;
                    });
                    setUserNames(nameMap);
                });
            });
    };

    useEffect(() => {
        fetchMessages();
    }, [groupId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Image picker logic
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };
    
    // Send message (with optional image)
    const handleSend = async (e) => {
        e.preventDefault();
        if (!msg.trim() && !selectedImage) return;

        let imageFileName = null;
        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);
            const res = await fetch('http://localhost:8080/groupChat/uploadImage', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                imageFileName = data.fileName;
            }
        }

        fetch(`http://localhost:8080/groupChat/${groupId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, msg, image: imageFileName })
        })
            .then(res => res.json())
            .then(newMsg => {
                setMessages(prev => [...prev, newMsg]);
                setMsg('');
                setSelectedImage(null);
                setImagePreview(null);
                // Fetch full name if not already loaded
                if (!userNames[newMsg.userId]) {
                    fetch(`http://localhost:8080/user/${newMsg.userId}/fullname`)
                        .then(res => res.json())
                        .then(res => setUserNames(prev => ({ ...prev, [newMsg.userId]: res.fullName })));
                }
            });
    };

    // Delete message
    const handleDelete = (msgId) => {
        fetch(`http://localhost:8080/groupChat/messages/${msgId}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    setMessages(prev => prev.filter(m => m.id !== msgId));
                }
            });
    };

    // Start editing
    const handleEdit = (msgId, currentMsg) => {
        setEditMsgId(msgId);
        setEditMsgValue(currentMsg);
    };

    // Save edited message
    const handleSaveEdit = (msgId) => {
        fetch(`http://localhost:8080/groupChat/messages/${msgId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: editMsgValue })
        })
            .then(res => res.json())
            .then(updatedMsg => {
                setMessages(prev =>
                    prev.map(m => m.id === msgId ? { ...m, msg: updatedMsg.msg } : m)
                );
                setEditMsgId(null);
                setEditMsgValue('');
            });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditMsgId(null);
        setEditMsgValue('');
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <NavBar />
            <br />
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                paddingTop: '80px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {/* Chat Header */}
                    <div style={{
                        backgroundColor: '#4285F4',
                        color: 'white',
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{groupTitle}</h2>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{messages.length} messages</div>
                    </div>

