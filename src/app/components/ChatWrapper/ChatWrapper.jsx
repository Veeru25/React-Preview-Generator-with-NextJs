'use client';

import { useState, useEffect } from 'react';
import Chats from "../Chats/Chats"
import History from "../History/History"
import { useUserSession } from '../../context/UserSessionContext'

const ChatWrapper = () => {
    const session = useUserSession();
    console.log("Contextsession",session.user.id)
    const [historyData, setHistoryData] = useState([]);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`https://react-preview-generator-with-next-js.vercel.app/api/history?userId=${session?.user?.id}`); 
                const data = await response.json();
                if (data.success) {
                    setHistoryData(data.data); 
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
            <Chats setHistoryData={setHistoryData} historyData={historyData} />
            <History historyData={historyData}/>
        </>
    )
}

export default ChatWrapper