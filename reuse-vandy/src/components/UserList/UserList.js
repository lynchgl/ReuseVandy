import React from 'react';

const UserList = ({ currentUser, users, selectedUser, setSelectedUser }) => {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li 
          key={user.id} 
          onClick={() => setSelectedUser(user)}
          style={{ fontWeight: selectedUser && selectedUser.id === user.id ? 'bold' : 'normal'}}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
