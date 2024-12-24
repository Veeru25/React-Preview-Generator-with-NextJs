// 'use client';

// import { useState, useEffect } from 'react';
// import Chats from "../Chats/Chats"
// import History from "../History/History"
// // import { useUserSession } from '../../context/UserSessionContext';

// const ChatWrapper = ({ userSession }) => {
//     const [historyData, setHistoryData] = useState([]);

//     // Fetch history data from the API
//     useEffect(() => {
//         const fetchHistory = async () => {
//             try {
//                 const response = await fetch(`/api/history?userId=${userSession?.user?.id}`); // Adjust the API endpoint as needed
//                 const data = await response.json();
//                 if (data.success) {
//                     setHistoryData(data.data); // Set the history data in state
//                 } else {
//                     console.error('Failed to fetch history data');
//                 }
//             } catch (error) {
//                 console.error('Error fetching history:', error);
//             }
//         };

//         fetchHistory();
//     }, []);

//     return (
//         <>
//             <Chats userSession={userSession} setHistoryData={setHistoryData} historyData={historyData} />
//             <History historyData={historyData} userSession={userSession} />
//         </>
//     )
// }

// export default ChatWrapper

'use client';

import { useState, useEffect } from 'react';
import Chats from "../Chats/Chats"
import History from "../History/History"
import { useUserSession } from '../../context/UserSessionContext'



const ChatWrapper = () => {
    const session = useUserSession();
    console.log("Contextsession",session.user.id)
    const [historyData, setHistoryData] = useState([]);

    // Fetch history data from the API
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/history?userId=${session?.user?.id}`); // Adjust the API endpoint as needed
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
            <Chats setHistoryData={setHistoryData} historyData={historyData} />
            <History historyData={historyData}/>
        </>
    )
}

export default ChatWrapper