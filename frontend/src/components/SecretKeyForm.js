// src/components/SecretKeyForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SecretKeyForm = ({ onSuccess }) => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://192.168.227.133:8000/api/check-secret-key/', { key: secretKey });
      if (response.status === 200) {
        onSuccess();
      }
    } catch (error) {
      setError("Invalid secret key!");
    }
  };

  return (
    <div>
      <h2>Введите секретный ключ</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <button type="submit">Отправить</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SecretKeyForm;
