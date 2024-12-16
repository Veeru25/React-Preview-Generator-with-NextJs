
'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import Markdown from 'markdown-to-jsx';
import ClipLoader from 'react-spinners/ClipLoader';
import {  TextField , Modal , Tooltip , CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Plus icon
import { useSearchParams } from 'next/navigation';
import styles from './chats.module.css';
// import { auth } from '../auth';

export default function Chats({ userSession, setHistoryData}) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [, set] = useState(false)
  const [savedHistory, setSavedHistory] = useState([]);
  const searchParams = useSearchParams();
  // const router = useRouter();


  useEffect(() => {
    const query = Object.fromEntries(searchParams.entries());
    // console.log("Query", query?.id)

    if (query?.id) {
      const endPoint = `http://localhost:3004/api/history?id=${query?.id}`
      // console.log('URL HAS ID')

      fetch(endPoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((res) => {
          // console.log('Fetched Data:', res?.data?.messages);
          setHistory(res?.data?.messages);
        })
        .catch((error) => {
          console.error('Error fetching chat history:', error);
        });
    } else {
      const storedHistory = localStorage.getItem('chatHistory');

      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          setSavedHistory(parsedHistory);
          setHistory(parsedHistory);
        } catch (error) {
          console.error('Error parsing chat history:', error);
        }
      }
    }
  }, [searchParams]);


  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  }, [history]);

  const onSend = async () => {
    if (!input.trim()) return;

    const userObj = {
      role: 'user',
      parts: [{ text: input }],
    };

    // console.log(history)

    const historyWithoutId = history.map(item => {
      // Remove the _id from the main object and from each part in the parts array
      const { _id, parts, ...rest } = item;
      const updatedParts = parts.map(part => {
        const { _id, ...restPart } = part;
        return restPart;  // Return the part without the _id
      });

      return { ...rest, parts: updatedParts };  // Return the item without the _id and with updated parts
    });

    // console.log(historyWithoutId);

    const updatedHistory = [...historyWithoutId, userObj];
    setHistory(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, history: updatedHistory }),
      });

      const data = await response.json();
      const resObj = {
        role: 'model',
        parts: [{ text: data.message }],
      };

      setHistory((prevState) => [...prevState, resObj]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };



  const onNewChat = async () => {

    const userId = await userSession?.user?.id

    // console.log(history[0].parts[0].text);

    console.log(userId)

    // console.log(history)
    // return;


    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Replace with the current user's ID
          chatName: history[0].parts[0].text, // Optional: Customize the chat name
          messages: history, // The chat history array
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Chat saved successfully:", data);


      setHistory([]);
      setInput("");
      setLoading(false);
      localStorage.removeItem('chatHistory');


      setHistoryData(prevData => {
        return [
          ...prevData,
          {
            "_id": data?.data?._id,
            "chatName": history[0].parts[0].text
          }
        ]
      })

      // router.push('/target-page');
      window.location.href = '/';

      // alert("Chat saved successfully!");


    } catch (error) {
      console.error("Error saving chat:", error);
      alert("Failed to save chat. Please try again.");
    }

  };



  const CodeWithPreview = ({ code }) => {
    const [openModal, setOpenModal] = useState(false);
    const [iframeContent, setIframeContent] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(true);

    const handlePreviewToggle = () => {
      setOpenModal(!openModal);
      setLoadingPreview(true);
    };

    useEffect(() => {
      const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Preview</title>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          ${code}
          ReactDOM.createRoot(document.getElementById('root')).render(<App />);
        </script>
      </body>
      </html>
    `;
      setIframeContent(htmlTemplate);
    }, [code]);

    return (
      <div className={styles.codeBox}>
        <div className={styles.buttonContainer}>
          <Tooltip title="Copy Code" arrow>
            <button
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(code)}
            >
              &#x2398;
            </button>
          </Tooltip>
        </div>

        <pre>
          <code>{code}</code>
        </pre>
        <div className={styles.previewButtonContainer}>
          <button className={styles.previewButton} onClick={handlePreviewToggle}>
            {openModal ? 'Close Preview' : 'Preview Output'}
          </button>
        </div>
        <Modal
          open={openModal}
          onClose={handlePreviewToggle}
          className={styles.modalContainer}
        >
          <div className={styles.modalContent}>
            <p className={styles.modalHeader}>Preview Output</p>

            {loadingPreview && <CircularProgress className={styles.modalLoading} />}

            <iframe
              title="output-preview"
              srcDoc={iframeContent}
              sandbox="allow-scripts allow-same-origin"
              className={`${styles.modalIframe} ${!loadingPreview ? styles.loaded : ''}`}
              onLoad={() => setLoadingPreview(false)}
            ></iframe>
          </div>
        </Modal>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.reactHeading}>React Code and Preview Generator</h1>
      <div className={styles.header}>
        <Tooltip title="New Chat" arrow>
          <button
            className={styles.newChatBtn}
            variant="contained"
            size="large"
            onClick={onNewChat}
            aria-label="Start a new chat"
          >
            <AddIcon />
          </button>
        </Tooltip>
        <TextField
          className={styles.inputField}
          variant="outlined"
          label="Ask Here..."
          value={input}
          onChange={handleInput}
        />

        <button
          className={styles.sendBtn}
          variant="contained"
          color="primary"
          size="large"
          onClick={onSend}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : 'SEND'}
        </button>
      </div>

      

      <div
        className={`${styles.chatHistory} ${history.length > 0 ? styles.chatHistoryWithPadding : ''
          }`}
      >
        {history.map((el, index) => (
          <div key={index} className={styles.messageContainer}>
            <div
              className={`${styles.chatMessage} ${el.role === 'user' ? styles.userMessage : styles.gptMessage
                }`}
            >
              {el?.parts?.map((part, i) => {
                const text = part?.text;
                const segments = text?.split(/(```[\s\S]*?```)/g);

                return segments?.map((segment, j) => {
                  if (segment?.startsWith('```') && segment?.endsWith('```')) {
                    const codeWithMetadata = segment?.slice(3, -3);
                    const [type, ...codeLines] = codeWithMetadata?.split('\n');
                    const code = codeLines?.join('\n');
                    return (
                      <div key={`${i}-${j}`}>
                        <div variant="caption" color="#000">
                          TYPE : {type}
                        </div>
                        <CodeWithPreview key={`${i}-${j}`} code={code} />
                      </div>
                    );
                  } else {
                    return (
                      <Markdown className={styles.explainContainer} key={`${i}-${j}`}>
                        {segment}
                      </Markdown>
                    );
                  }
                });
              })}
            </div>
          </div>
        ))}
        {loading && (
          <div>
            <ClipLoader color="#4A90E2" size={15} />
            <span className={styles.spanLoading}>...Loading</span>
          </div>
        )}
      </div>

    </div>
  );
}

