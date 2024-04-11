import React from 'react';
import './MessagingInteraction.css';

const MessagingInteraction = ({ selectedUser, messages }) => {
    // Filter messages based on the selected user
    const filteredMessages = selectedUser
        ? messages.filter(
            (message) =>
                message.senderId === selectedUser.userId || message.receiverId === selectedUser.userId
        )
        : [];

    console.log('Selected User:', selectedUser);
    console.log('Filtered Messages:', filteredMessages);

    return (
        <div className="messaging-interaction">
            <h2>Messaging Interaction</h2>
            {selectedUser ? (
                <div>
                    <h3>{selectedUser.displayName || selectedUser.email}</h3>
                    <ul>
                        {filteredMessages.map((message) => (
                            <li key={message.id}>
                                {message.content} - {message.timestamp.toDate().toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Select a user from the list to view messaging interactions.</p>
            )}
        </div>
    );
};

export default MessagingInteraction;
