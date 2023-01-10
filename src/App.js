import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import recordingsService from './Services/recordings.service';
import RecordingsList from './components/Recordings/RecordingsList/RecordingsList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }
  async componentDidMount() {
    await recordingsService.addRecordings();
  }

  render() {
    return (
      <RecordingsList></RecordingsList>
    );
  }
}

export default App;
