import { React, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { dbMessages } from '../../services/firebase.config';
import './MessagingInteraction.css';

const MessagingInteraction = ({ currentUser, selectedUser, messages, updateMessages }) => {
    // Filter messages based on the selected user
    const filteredMessages = selectedUser
        ? messages.filter(
            (message) =>
                message.senderId === selectedUser.userId || message.receiverId === selectedUser.userId
        )
        : [];

    console.log('Selected User:', selectedUser);
    console.log('Filtered Messages:', filteredMessages);

    const [replyContent, setReplyContent] = useState('');

    const handleReplyChange = (event) => {
        setReplyContent(event.target.value);
    };

    const handleReply = async () => {
        try {
            const newMessage = {
                content: replyContent,
                senderId: currentUser.uid,
                receiverId: selectedUser.userId,
                timestamp: new Date()
            };

            await addDoc(collection(dbMessages, 'messages'), newMessage);

            console.log("Message sent:", newMessage);

            setReplyContent('');

            updateMessages([newMessage, ...messages]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        // Add logic to handle reply button click
        console.log('Reply content:', replyContent);
    };

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
                                {message.listingName && (
                                    <div className="listing-name">
                                    In regards to {message.listingName} listed by {message.listingPerson}
                                </div>
                                )}
                                {message.content}
                            </div>
                        ))}
                    </div>
                    <div className="reply-container">
                        <textarea
                            value={replyContent}
                            onChange={handleReplyChange}
                            className="reply-textarea"
                            placeholder="Type your reply here..."
                            rows={4}
                        ></textarea>
                        <button className="reply-button" onClick={handleReply}>Reply</button>
                    </div>
                </div>
            ) : (
                <p>Select a user from the list to view messaging interactions.</p>
            )}
        </div>
    );
};

export default MessagingInteraction;
