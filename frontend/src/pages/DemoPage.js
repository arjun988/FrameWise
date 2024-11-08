import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Paper from '@mui/material/Paper';

function DemoPage() {
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUrlSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/scrape', { url });
      setContext(response.data.context);
      alert('Documentation scraped successfully!');
    } catch (error) {
      console.error('Error scraping docs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/ask', { question, context });
      const newAnswer = response.data.answer;
      setAnswer(newAnswer);

      // Update conversation history with question and answer
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { question, answer: newAnswer },
      ]);

      setQuestion(''); // Clear question input after submission
    } catch (error) {
      console.error('Error getting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="false"
      sx={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        color: '#fff',
        background: 'linear-gradient(135deg, #2f2f40, #4c4c6c)',
        minHeight: '100vh',
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      {/* Left Section - Upload and Ask Form */}
      <Box sx={{ flex: 1, maxWidth: '50%', mr: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(90deg, #3d5afe, #ff4081)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2rem',
            animation: 'fadeIn 1s ease-out',
          }}
        >
          Scrape It !
        </Typography>

        {/* URL Input and Button */}
        <TextField
          fullWidth
          variant="outlined"
          label="Enter documentation URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{
            backgroundColor: '#333',
            borderRadius: '8px',
            mb: 2,
            '& .MuiInputBase-root': { color: '#fff' },
            '& .MuiInputLabel-root': { color: '#b0b0c8' },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#ff4081' },
              '&.Mui-focused fieldset': { borderColor: '#ff4081' },
            },
          }}
        />
        <Button
          startIcon={<CloudDownloadIcon />}
          variant="contained"
          color="secondary"
          onClick={handleUrlSubmit}
          sx={{
            background: 'linear-gradient(90deg, #3d5afe, #ff4081)',
            color: '#fff',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(255, 64, 129, 0.4)',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: '#ff4081',
              transform: 'scale(1.05)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Scrape Docs'}
        </Button>

        {/* Question Input and Button */}
        <TextField
          fullWidth
          variant="outlined"
          label="Ask a question"
          multiline
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{
            backgroundColor: '#333',
            borderRadius: '8px',
            mb: 2,
            '& .MuiInputBase-root': { color: '#fff' },
            '& .MuiInputLabel-root': { color: '#b0b0c8' },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#ff4081' },
              '&.Mui-focused fieldset': { borderColor: '#ff4081' },
            },
          }}
        />
        <Button
          startIcon={<QuestionAnswerIcon />}
          variant="contained"
          color="primary"
          onClick={handleQuestionSubmit}
          sx={{
            background: 'linear-gradient(90deg, #3d5afe, #ff4081)',
            color: '#fff',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(61, 90, 254, 0.4)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: '#ff4081',
              transform: 'scale(1.05)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
        </Button>

        {/* Display current answer */}
        {answer && (
          <Box
            sx={{
              background: '#333',
              padding: '20px',
              borderRadius: '8px',
              color: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Typography variant="h5" sx={{ color: '#ff4081', mb: 2 }}>
              Answer:
            </Typography>
            <Typography variant="body1">{answer}</Typography>
          </Box>
        )}
      </Box>

      {/* Right Section - Conversation History */}
      <Paper
        sx={{
          width: '40%',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#ff4081',
            fontWeight: 700,
            mb: 2,
            animation: 'fadeIn 1s ease-out',
          }}
        >
          Conversation History
        </Typography>
        {conversationHistory.length > 0 ? (
          conversationHistory.map((entry, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: '8px',
                backgroundColor: '#444',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Question:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {entry.question}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Answer:
              </Typography>
              <Typography variant="body2">{entry.answer}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#b0b0c8' }}>
            No conversation history yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default DemoPage;
