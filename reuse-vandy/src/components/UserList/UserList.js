import React from 'react';
import './UserList.css';

const UserList = ({ users, selectedUser, setSelectedUser }) => {
  return (
    <div className="user-list">
      <ul>
        {users.map((user) => (
          user &&
          <li
            key={user.id}
            className={`user-list-item ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
            onClick={() => setSelectedUser(user)}
            style={{ fontWeight: selectedUser && selectedUser.id === user.id ? 'bold' : 'normal' }}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
