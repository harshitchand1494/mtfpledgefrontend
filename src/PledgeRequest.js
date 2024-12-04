import React, { useState } from 'react';
import axios from 'axios';

const PledgeRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [htmlContent, setHtmlContent] = useState(null); // State to store HTML content for iframe

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setHtmlContent(null); // Reset iframe content before submitting

        try {
            // API call to hit the endpoint
            const response = await axios.post('http://localhost:3001/submit-pledge', {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'text' // Ensures we get the response as raw text (HTML)
            });

            // Check if the response is in HTML format
            if (response.headers['content-type']?.includes('text/html')) {
                // Display the HTML response in an iframe
                setHtmlContent(response.data); // Set HTML content for iframe
                setSuccess("Pledge request submitted successfully.");
            } else {
                console.log('Non-HTML Response:', response.data);
            }
        } catch (error) {
            // Improved error handling
            console.error("Error:", error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message || error.message : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Submit Pledge Request</h1>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
            </button>

            {/* Display the success message if the request was successful */}
            {success && (
                <div style={{ color: 'green', marginTop: '10px' }}>
                    {success}
                </div>
            )}

            {/* Display the error message if there is one */}
            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                </div>
            )}

            {/* Display the HTML response in an iframe if present */}
            {htmlContent && (
                <iframe
                    title="Pledge Request Response"
                    srcDoc={htmlContent} // Use srcDoc to directly set the HTML content
                    style={{
                        width: '100%',
                        height: '500px',
                        border: '1px solid #ccc',
                        marginTop: '20px'
                    }}
                />
            )}
        </div>
    );
};

export default PledgeRequest;
