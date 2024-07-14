import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [videoUrl, setVideoUrl] = useState('');
    const [mp3Url, setMp3Url] = useState(''); // State to store the MP3 URL
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading state
    const [downloadClicked, setDownloadClicked] = useState(false); // State to track download button click

    const handleInputChange = (e) => {
        setVideoUrl(e.target.value);
    };

    const handleSearch = async () => {
        if (videoUrl) {
            setLoading(true); 
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/convert`, { url: videoUrl });
                setMp3Url(response.data.link);
                console.log(response.data.link);
                setError('');
                setDownloadClicked(true);
            } catch (err) {
                setError('Failed to fetch MP3 URL. Please check the video URL.');
                setMp3Url('');
            } finally {
                setLoading(false); // Stop loading indicator
            }
        } else {
            setError('Please enter a valid YouTube URL.');
            setMp3Url('');
        }
    };

    const handleDownloadComplete = () => {
        setDownloadClicked(false);
        setVideoUrl(''); // Reset the videoUrl after download is complete
        setMp3Url(''); // Reset the mp3Url after download is complete
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center p-6 bg-white rounded-md shadow-md">
                <h1 className="text-2xl font-bold mb-4">YouTube Audio Downloader</h1>
                <p className="mb-4 text-gray-600">Enter the YouTube video link below to download its audio.</p>
                {!downloadClicked && ( // Render input section only if download not clicked
                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            placeholder="YouTube video link..."
                            value={videoUrl}
                            onChange={handleInputChange}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {mp3Url && downloadClicked && ( // Render download button only if download clicked and mp3Url is available
                    <a
                        href={mp3Url}
                        download
                        onClick={handleDownloadComplete}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Download Audio
                    </a>
                )}
            </div>
        </div>
    );
}

export default App;
