import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { dbMessages, auth, dbUsers } from '../../services/firebase.config';
import UserList from './UserList/UserList';
import MessagingInteraction from './MessagingInteraction/MessagingInteraction';


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMessages = async () => {
        try {
          // Messages sent by current user
          const sentMessagesQuery = query(
            collection(dbMessages, 'messages'),
            orderBy('timestamp', 'desc'),
            where('senderId', '==', currentUser.uid)
          );

          const sentQuerySnapshot = await getDocs(sentMessagesQuery);
          const sentMessages = sentQuerySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data() }));

          console.log("Sent messages: ", sentMessages);

          // Messages received by current user
          const receivedMessageQuery = query(
            collection(dbMessages, 'messages'),
            orderBy('timestamp', 'desc'),
            where('receiverId', '==', currentUser.uid)
          );

          const q = query(
            collection(dbMessages, 'messages'),
            orderBy('timestamp', 'desc'),
            where('senderId', '==', currentUser.uid),
          );

          const receivedQuerySnapshot = await getDocs(receivedMessageQuery);
          const receivedMessages = receivedQuerySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data() }))

          console.log("Received messages: ", receivedMessages);

          // Combine sent and received messages
          const allMessages = [...sentMessages, ...receivedMessages];

          // Sort combined messages by timestamp
          allMessages.sort((a, b) => b.timestamp - a.timestamp);

          setMessages(allMessages);

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
