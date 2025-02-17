import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Modal, Alert, Table } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const CallForm = ({ onSubmit }) => {
    const [order_id, setOrder] = useState(''); // Инициализация order как строка (ID из базы)
    const [order_name, setOrderName] = useState('');
    const [orders, setOrders] = useState([]); // Состояние для списка orders
    const [zone, setZone] = useState('');
    const [nadzor_num, setNadzorNum] = useState('');
    const [nadzor_date, setNadzorDate] = useState('');
    const [works, setWorks] = useState('');
    const [interval, setInterval] = useState('');
    const [diameter, setDiameter] = useState('');
    const [length, setLength] = useState('');
    const [material, setMaterial] = useState('');
    const [agent, setAgent] = useState('');
    const [agent_phone, setAgentPhone] = useState('');
    const [meet_date, setMeetDate] = useState(() => {
        // Устанавливаем завтрашнюю дату с временем 10:00
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1); // Добавляем 1 день (завтра)
        defaultDate.setHours(10, 0, 0, 0); // Устанавливаем время на 10:00:00
        return defaultDate;
    });
    const [meet_place, setMeetPlace] = useState('');
    const [prev_calls, setPrevCalls] = useState([]);
    const [loading, setLoading] = useState(false); // Индикатор состояния загрузки
    const [showModal, setShowModal] = useState(false); // Состояние для модального окна

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://192.168.227.133:8000/api/orders/');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const resetFields = async () => {
        setZone('');
        setNadzorNum('');
        setNadzorDate('');
        setWorks('');
        // eslint-disable-next-line
        setInterval('');
        setDiameter('');
        setLength('');
        setMaterial('');
        setAgent('');
        setAgentPhone('');
        setMeetPlace('');
        setPrevCalls([]);
    }

    const getPrevValues = async (e) => {
        resetFields();
        try {
            const response = await axios.get(`http://192.168.227.133:8000/api/calls/last-call-by-order/${e}`);
            const get_prev_calls = await axios.get(`http://192.168.227.133:8000/api/calls/prev-calls-by-order/${e}`);
            setPrevCalls(get_prev_calls.data);

            setZone(response.data['zone'] || '');
            setNadzorNum(response.data['nadzor_num'] || '');
            setNadzorDate(response.data['nadzor_date'] || '');
            setWorks(response.data['works'] || '');
            setInterval(response.data['interval'] || '');
            setDiameter(response.data['diameter'] || '');
            setLength(response.data['length'] || '');
            setMaterial(response.data['material'] || '');
            setAgent(response.data['agent'] || '');
            setAgentPhone(response.data['agent_phone'] || '');
            setMeetPlace(response.data['meet_place'] || '');
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const order_response = await axios.get(`http://192.168.227.133:8000/api/orders/${order_id}`);
        console.log(order_response);
        setOrderName(order_response.data['object_short_name']);

        setShowModal(true);
    };

    const handleModal = async () => {
        setShowModal(false);

        const formattedNadzorDate = nadzor_date ? nadzor_date : null;

        const newCall = {
            order_id,
            zone,
            nadzor_num,
            nadzor_date: formattedNadzorDate,
            works,
            interval,
            diameter,
            length,
            material,
            agent,
            agent_phone,
            meet_date,
            meet_place
        };

        setLoading(true);

        try {
            const response = await axios.post('http://192.168.227.133:8000/api/calls/', newCall, {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const formattedDate = new Date(newCall['meet_date']).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            var objectShortName = await axios.get(`http://192.168.227.133:8000/api/orders/${newCall['order_id']}`);
            objectShortName = objectShortName.data['object_short_name'];
            link.setAttribute('download', `Вызов ${newCall['zone']} объект ${objectShortName} на ${formattedDate}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Ошибка при создании вызова или загрузке файла:', error);

            if (error.response) {
                const reader = new FileReader();
                reader.onload = function () {
                    console.error('Ошибка от сервера:', reader.result);
                };
                reader.readAsText(error.response.data);
            }
        } finally {
            resetFields()
            setOrder('')
            setLoading(false);
        }
    };

    return (
        <Container>
            {loading && (
                <Row className="mt-3">
                    <Col md={12}>
                        <Alert variant='warning'>
                            Пожалуйста, ожидайте, когда ваш файл будет готов
                        </Alert>
                    </Col>
                </Row>
            )}

            {prev_calls.length > 0 && (
                <Row className="mt-3">
                    <Col md={12}>
                        <Alert variant='success'>
                            <h4 style={{ color: 'brown' }}>Все вызовы по этому контракту (от новых к старым):</h4>

                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Служба</th>
                                        <th>Работы</th>
                                        <th>Представитель</th>
                                        <th>Номер телефона</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {prev_calls.map((callItem) => (
                                        <tr>
                                            <td>{callItem.zone}</td>
                                            <td>{callItem.works}</td>
                                            <td>{callItem.agent}</td>
                                            <td>{callItem.agent_phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Alert>
                    </Col>
                </Row>
            )}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="order_id">
                            <Form.Label>Кодовое название объекта</Form.Label>
                            <Form.Control
                                required
                                as="select"
                                value={order_id}
                                onChange={(e) => {
                                    setOrder(e.target.value);
                                    getPrevValues(e.target.value);
                                }}
                            >
                                <option disabled value="">Выберите из списка</option>
                                {orders.map((orderItem) => (
                                    <option key={orderItem.id} value={orderItem.id}>
                                        {orderItem.object_short_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="zone">
                            <Form.Label>Районная служба</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="nadzor_num">
                            <Form.Label>Договор на ТН</Form.Label>
                            <Form.Control
                                type="text"
                                value={nadzor_num}
                                onChange={(e) => setNadzorNum(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="nadzor_date">
                            <Form.Label>Дата договора на ТН</Form.Label>
                            <Form.Control
                                type="date"
                                value={nadzor_date}
                                onChange={(e) => setNadzorDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="works">
                            <Form.Label>Предъявляемые работы</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={works}
                                onChange={(e) => setWorks(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="interval">
                            <Form.Label>Интервал</Form.Label>
                            <Form.Control
                                type="text"
                                value={interval}
                                onChange={(e) => setInterval(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="diameter">
                            <Form.Label>Диаметр</Form.Label>
                            <Form.Control
                                type="text"
                                value={diameter}
                                onChange={(e) => setDiameter(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="length">
                            <Form.Label>Длина</Form.Label>
                            <Form.Control
                                type="text"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="material">
                            <Form.Label>Материал</Form.Label>
                            <Form.Control
                                type="text"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="agent">
                            <Form.Label>Представитель</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={agent}
                                onChange={(e) => setAgent(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="agent_phone">
                            <Form.Label>Контакт представителя</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={agent_phone}
                                onChange={(e) => setAgentPhone(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="meet_place">
                            <Form.Label>Место встречи (адрес)</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={meet_place}
                                onChange={(e) => setMeetPlace(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} className="mt-4 mb-2">
                        <Form.Group controlId="meet_date">
                            <Form.Label>Дата встречи</Form.Label>&nbsp;
                            <DatePicker
                                selected={meet_date}
                                onChange={(date) => setMeetDate(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd.MM.yyyy HH:mm"
                                className="form-control"
                            />

                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type='submit'>
                    Создать вызов
                </Button>
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение данных</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='mb-3'><Alert variant='warning'>Проверьте правильность введённых данных перед отправкой.</Alert></p>
                    <hr></hr>
                    <p><strong>Кодовое название объекта:</strong> {order_name ? order_name : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Районная служба:</strong> {zone ? zone : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Договор на ТН:</strong> {nadzor_num ? nadzor_num : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Дата договора:</strong> {nadzor_date ? nadzor_date : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Работы:</strong> {works ? works : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Интервал:</strong> {interval ? interval : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Диаметр:</strong> {diameter ? diameter : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Длина:</strong> {length ? length : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Материал:</strong> {material ? material : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Представитель:</strong> {agent ? agent : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Контакт:</strong> {agent_phone ? agent_phone : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Место встречи:</strong> {meet_place ? meet_place : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                    <p><strong>Дата встречи:</strong> {meet_date ? meet_date.toLocaleString() : <span style={{ color: 'red' }}>Информация отсутствует</span>}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleModal}>
                        Подтвердить и отправить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CallForm;
