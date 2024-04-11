import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { dbMessages, auth, dbUsers } from '../../services/firebase.config';


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMessages = async () => {
        try {
          const q = query(
            collection(dbMessages, 'messages'),
            orderBy('timestamp', 'desc'),
            //where('senderId', '==', currentUser.uid),
           // where('receiverId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          console.log('Query Snapshot:', querySnapshot);
          const fetchedMessages = [];
          querySnapshot.forEach((doc) => {
            fetchedMessages.push({ id: doc.id, ...doc.data() });
          });
          console.log('Fetched Messages:', fetchedMessages);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      

    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser]);

  return (
    <div>
      <h1>Your Messages</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              {/* Display message content and other details */}
              <p>{message.content}</p>
              {/* Add more message details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
