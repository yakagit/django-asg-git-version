import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import CallForm from './CallForm'; // Компонент для добавления новых вызовов
import { Container, Table, Accordion } from 'react-bootstrap';

const Weather = () => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    
  }, []);

  return (
    <Container className='mt-3'>
      <h1>Погода</h1>
      <CallForm onSubmit={handleNewCall} />
    </Container>
  );
};

export default Weather;
