import React, { useState } from 'react';
import axios from 'axios';
import './styles/userform.css'; // You can add your CSS styles here.

const FileUploadForm = () => {
    const [name, setName] = useState('');
    const [socialMediaHandle, setSocialMediaHandle] = useState('');
    const [images, setImages] = useState(null);
    const [message, setMessage] = useState('');

    // Handle file selection
    const handleFileChange = (event) => {
        setImages(event.target.files); // Capture the selected files
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        const formData = new FormData(); // Create FormData instance to send form data
        formData.append('name', name);
        formData.append('socialMediaHandle', socialMediaHandle);

        // Append images to the form data (multiple files)
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            // Make POST request to the backend
            const response = await axios.post('http://localhost:5000/api/users/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message); // Display the success message from backend
        } catch (error) {
            // Catch any errors and display them
            setMessage(error.response ? error.response.data.message : 'Error submitting data');
            console.error('Error:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Submit Your Data</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="socialMediaHandle">Social Media Handle:</label>
                    <input
                        type="text"
                        id="socialMediaHandle"
                        value={socialMediaHandle}
                        onChange={(e) => setSocialMediaHandle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="images">Upload Images (max 10):</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>} {/* Display success or error message */}
        </div>
    );
};

export default FileUploadForm;
