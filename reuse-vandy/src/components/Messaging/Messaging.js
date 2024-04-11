import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { dbMessages, auth, dbProfiles } from '../../services/firebase.config';
import UserList from '../UserList/UserList'
import MessagingInteraction from '../MessagingInteraction/MessagingInteraction';
import './Messaging.css'

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
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
        const sentMessages = sentQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Messages received by current user
        const receivedMessageQuery = query(
          collection(dbMessages, 'messages'),
          orderBy('timestamp', 'desc'),
          where('receiverId', '==', currentUser.uid)
        );

        const receivedQuerySnapshot = await getDocs(receivedMessageQuery);
        const receivedMessages = receivedQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        // Combine sent and received messages
        const allMessages = [...sentMessages, ...receivedMessages];

        // Sort combined messages by timestamp
        allMessages.sort((a, b) => b.timestamp - a.timestamp);

        setMessages(allMessages);

      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersSet = new Set();

        // Extract users from messages
        messages.forEach((message) => {
          if (message.senderId !== currentUser.uid) {
            usersSet.add(message.senderId);
          }
          if (message.receiverId !== currentUser.uid) {
            usersSet.add(message.receiverId);
          }
        });

        // Query user details
        const usersQueryPromises = Array.from(usersSet).map(async (userId) => {
          const userDoc = await getDocs(query(collection(dbProfiles, 'profiles'), where('userId', '==', userId)));
          return userDoc.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];
        });

        const usersData = await Promise.all(usersQueryPromises);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };


    if (currentUser) {
      fetchMessages();
      fetchUsers();
    }
  }, [currentUser, messages]);

  return (
    <div className="messages-container">
      <div className="user-list-column">
        <UserList users={users} selectedUser = {selectedUser} setSelectedUser={setSelectedUser} />
      </div>
      <div className="messaging-interaction-column">
        <MessagingInteraction selectedUser={selectedUser} messages={messages} />
      </div>
    </div>
  );
};

export default Messages;