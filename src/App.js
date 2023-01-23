import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import {Routes, Route} from 'react-router-dom';
import recordingsService from './Services/recordings.service';
import RecordingsList from './components/Recordings/RecordingsList/RecordingsList';
import Add from './components/Recordings/Add/Add';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
    recordingsService.addRecordings();
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
      <Container>
        <Navbar.Brand href="home">MusicApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="home">Home Page</Nav.Link>
            <Nav.Link href="add">Add new recording</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        <Routes>
          <Route path="/" element={<RecordingsList/>}/>
          <Route path="/home" element={<RecordingsList/>}/>
          <Route path="/add" element={<Add/>}/>
        </Routes>
      </div>
    );
  }
}

export default App;
