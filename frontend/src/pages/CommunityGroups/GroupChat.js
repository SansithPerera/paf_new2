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
