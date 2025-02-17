import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CallForm from './CallForm';
import { Container, Table, Accordion } from 'react-bootstrap';

const CallList = () => {
  const [calls, setCalls] = useState([]);
  const [headers, setHeaders] = useState([]);
  const columnNames = {
    order: 'Кодовое название объекта',
    meet_date: 'Дата встречи',
    zone: 'Район',
    works: 'Работы',
    interval: 'Интервал',
    diameter: 'Диаметр',
    length: 'Длина',
    material: 'Материал',
    agent: 'Представитель',
    agent_phone: 'Контакт',
    meet_place: 'Место встречи',
    nadzor_num: 'Договор на ТН',
    nadzor_date: 'Дата договора ТН',
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await axios.get('http://192.168.227.133:8000/api/calls/');
      setCalls(response.data);

      if (response.data.length > 0) {
        setHeaders(Object.keys(response.data[0]));
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const handleNewCall = async (call) => {
    try {
      await axios.post('http://192.168.227.133:8000/api/calls/', call);
      fetchCalls();
    } catch (error) {
      console.error('Error adding call:', error);
    }
  };

  return (
    <Container className='mt-3'>
      <h1>Вызовы</h1>
      <CallForm onSubmit={handleNewCall} />

      <Accordion defaultActiveKey={null} alwaysOpen className='mt-4 mb-3'>
        <Accordion.Item eventKey="0">
          <Accordion.Header><strong>Кликните сюда, чтобы увидеть старые вызовы</strong></Accordion.Header>
          <Accordion.Body>
            <div style={{ overflowX: 'auto' }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {Object.keys(columnNames).map((key, index) => (
                      <th key={index} style={key === 'agent_phone' || key === 'order' ? { minWidth: '170px' } : {}}>
                        {columnNames[key]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call, index) => (
                    <tr key={call.id || index}>
                      {Object.keys(columnNames).map((key) => (
                        <td key={key}>
                          {key === 'order'
                            ? call[key]?.object_short_name
                            : !isNaN(Date.parse(call[key])) & key === 'meet_date'
                              ? new Date(call[key]).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })
                              : call[key]?.toString() || ''
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default CallList;
