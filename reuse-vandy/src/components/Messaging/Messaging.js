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
                    orderBy('timestamp', 'desc'),
                    where('senderId', '==', userId).orderBy('timestamp', 'desc'),
                    where('receiverId', '==', userId).orderBy('timestamp', 'desc')
                );
                
                const querySnapshot = await getDocs(q);

                const fetchedMessages = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

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
