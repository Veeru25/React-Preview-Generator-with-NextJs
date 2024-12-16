'use client';

import { useState, useEffect } from 'react';
import Chats from "./Chats"
import History from "./History"

const ChatWrapper = ({ userSession }) => {
    const [historyData, setHistoryData] = useState([]);

    // Fetch history data from the API
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('/api/history'); // Adjust the API endpoint as needed
                const data = await response.json();
                if (data.success) {
                    setHistoryData(data.data); // Set the history data in state
                } else {
                    console.error('Failed to fetch history data');
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <>
            <Chats userSession={userSession} setHistoryData={setHistoryData}/>
            <History historyData={historyData}  />
        </>
    )
}

export default ChatWrapper