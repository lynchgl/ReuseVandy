import React from 'react';
import './MessagingInteraction.css';

const MessagingInteraction = ({ currentUser, selectedUser, messages }) => {
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
            {selectedUser ? (
                <div>
                    <h3>{selectedUser.displayName || selectedUser.email}</h3>
                    <div className="message-container">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-bubble ${message.senderId === selectedUser.userId ? 'received-message' : 'sent-message'}`}
                            >
                                {message.content} - {message.timestamp.toDate().toLocaleString()}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Select a user from the list to view messaging interactions.</p>
            )}
        </div>
    );
};

export default MessagingInteraction;
