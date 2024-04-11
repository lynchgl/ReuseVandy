import React, { useState, useEffect } from 'react';
import { query, collection, where, getDocs, orderBy } from 'firebase/firestore';
import { dbMessages } from '../../services/firebase.config';

const Message = ({ userId }) => {
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const q = query(
                    collection(dbMessages),
                    where('senderId', '==', userId),
                    where('receiverId', '==', userId),
                    orderBy('timestamp', 'desc')
                );
        
                console.log('Firestore Query:', q); // Log Firestore query
        
                const querySnapshot = await getDocs(q);
        
                console.log('Query Snapshot:', querySnapshot); // Log query snapshot
        
                const fetchedMessages = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
        
                console.log('Fetched Messages:', fetchedMessages); // Log fetched messages
        
                setMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        
        
        

        fetchMessages();
    }, [userId]);

    return (
        <div>
            <h2>Your Messages</h2>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <p>Message: {message.content}</p>
                        <p>Sender ID: {message.senderId}</p>
                        <p>Receiver ID: {message.receiverId}</p>
                        <p>Timestamp: {message.timestamp}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Message;
