import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Dashboard.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/submissions') // Replace with your API endpoint
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Open modal and set selected user
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <div className="profile">
          <img
            src="./admin.jpg"
            alt="Admin Profile"
            className="profile-image"
          />
          <h3>Admin Name</h3>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#profile">Admin Profile</a>
          </li>
          <li>
            <a href="#userdata">User Data</a>
          </li>
        </ul>
        <div className="logout">
          <a href="#logout">Logout</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>User Submissions</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Social Media Handle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.socialMediaHandle}</td>
                <td>
                  <button
                    className="view-profile-button"
                    onClick={() => handleViewProfile(user)}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for viewing user profile */}
        {showModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{selectedUser.name}</h2>
              <p>Social Media Handle: {selectedUser.socialMediaHandle}</p>
              <div className="modal-images">
                {selectedUser.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image}`}
                    alt={`User Image ${index + 1}`}
                    className="modal-image"
                  />
                ))}
              </div>
              <button
                onClick={handleCloseModal}
                className="close-button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
