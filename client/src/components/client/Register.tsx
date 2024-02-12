import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  commonStyles,
  chatStyles,
  messageInputStyles,
} from'../../styles';
import { register } from '../../api/auth';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const handleRegistration = async (e: any) => {
    e.preventDefault();

    try {
      const response = await register(email, password, username);

      localStorage.setItem("token", response.token);

      navigate("/chat");
    } catch (error) {
      console.error('Login error:', error.message);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ ...commonStyles, ...chatStyles.chatContainer }}>
      <h2>Login Page</h2>
      <form onSubmit={handleRegistration} style={messageInputStyles.messageForm}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={messageInputStyles.input}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={messageInputStyles.input}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={messageInputStyles.input}
            required
          />
        </label>
        <br />
        <button type="submit" style={messageInputStyles.button}>
          Register
        </button>
      </form>
    </div>
  );
};