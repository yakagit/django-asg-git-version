import React from 'react';
import CallList from './components/CallList';
import Home from './components/Home';
import logo from './logo.png';

import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import './App.css'

function App() {
    return (
        <CallList></CallList>

        // В разработке
        // <Router>
        //     <Navbar>
        //         <Navbar.Brand href="/">
        //             <div className="d-flex align-items-center">
        //                 <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />{' '}
        //                 <span className="ms-3 main-text">АКВА-СТРОЙ ГАРАНТ: ПРОИЗВОДСТВЕННО-ТЕХНИЧЕСКИЙ ОТДЕЛ</span>
        //             </div>
        //         </Navbar.Brand>
        //     </Navbar>

        //     <Container fluid>
        //         <Row>
        //             <div className="App">
        //                 <Col className="sidebar main-navbar" sm={12} lg={3}>
        //                     <Nav className="flex-column">
        //                         <Accordion >
        //                             <Accordion.Item eventKey="0">
        //                                 <Accordion.Header>Справочники</Accordion.Header>
        //                                 <Accordion.Body>
        //                                     <Nav.Link as={Link} to="/callList" className="border p-2 mb-2">
        //                                         Вызовы
        //                                     </Nav.Link>
        //                                     <Nav.Link as={Link} to="/contacts" className="border p-2 mb-2">
        //                                         Погода
        //                                     </Nav.Link>
        //                                 </Accordion.Body>
        //                             </Accordion.Item>
        //                             <Accordion.Item eventKey="1">
        //                                 <Accordion.Header>*в разработке*</Accordion.Header>
        //                                 <Accordion.Body>
        //                                     2
        //                                 </Accordion.Body>
        //                             </Accordion.Item>
        //                         </Accordion>
        //                     </Nav>
        //                 </Col>

        //                 <Col className='main-content' sm={12} lg={9}>
        //                     <main>
        //                         <Routes>
        //                             <Route path="/" element={<Home />} />
        //                             <Route path="/contacts" element={<Contact />} />
        //                         </Routes>
        //                     </main>
        //                 </Col>

        //             </div>
        //         </Row>
        //     </Container>
        // </Router>
    );
}

export default App;
