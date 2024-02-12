import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  commonStyles,
  chatStyles,
  messageInputStyles,
} from'../../styles';
import { login } from '../../api/auth';

export const Login = () => {
  const [email, setEmail] = useState('ia13m@gregholmes.co.uk');
  const [password, setPassword] = useState('helloworld');

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await login(email, password);

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
      <form onSubmit={handleLogin} style={messageInputStyles.messageForm}>
        <div style={chatStyles.formRowStyles}>
          <label style={chatStyles.labelStyles}>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={chatStyles.inputStyles}
            required
          />
        </div>
        <div style={chatStyles.formRowStyles}>
          <label style={chatStyles.labelStyles}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={chatStyles.inputStyles}
            required
          />
        </div>
        <button type="submit" style={chatStyles.submitButtonStyles}>
          Login
        </button>
      </form>
    </div>
  );
};