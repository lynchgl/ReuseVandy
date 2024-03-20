import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { dbUsers } from '../services/firebase.config';

const EditProfile = ({ name, age, bio }) => {
  const [editedName, setEditedName] = useState(name);
  const [editedAge, setEditedAge] = useState(age);
  const [editedBio, setEditedBio] = useState(bio);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const profileDoc = doc(dbUsers, 'profiles', 'profileId'); // Assuming you have a specific profile document ID
      await updateDoc(profileDoc, {
        name: editedName,
        age: parseInt(editedAge),
        bio: editedBio,
      });

      // Close the modal or handle any other necessary actions
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#editProfileModal"
      >
        Edit Profile
      </button>

      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form className="d-flex" onSubmit={handleEdit}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ageInput" className="form-label">Age:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="ageInput"
                    value={editedAge}
                    onChange={(e) => setEditedAge(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bioInput" className="form-label">Bio:</label>
                  <textarea
                    className="form-control"
                    id="bioInput"
                    rows="3"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
