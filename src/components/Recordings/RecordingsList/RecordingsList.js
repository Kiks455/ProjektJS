import React from 'react';
import PropTypes from 'prop-types';
import styles from './RecordingsList.module.css';
import recordingsService from '../../../Services/recordings.service';
import { Container, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import Recording from '../Recording/Recording';

class RecordingsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: '',
      recordingsbeforeFiltering:[],
      recordings: []
    }

    this.filterRecordings=this.filterRecordings.bind(this);
  }
  async componentDidMount(){
    const recordings = await recordingsService.getRecordings();

    this.setState({
      recordingsbeforeFiltering:recordings,
      recordings:recordings
    })
  }

  filterRecordings(e){
    const value=e.target.value;
    const recordings=this.state.recordingsbeforeFiltering.filter(recording=>recording.title.toLowerCase().startsWith(value.toLowerCase()));

    this.setState({
      recordings:recordings,
      filterValue:value
    })
  }

  render() {
    return (
      <Container>
        <Form.Control className='my-3' placeholder='Filter recordings by title' value={this.state.filterValue} onChange={this.filterRecordings}></Form.Control>
        <ListGroup as='ul'>
          {this.state.recordings.map(recording => <ListGroupItem key={recording.id} as='li'>
            <Recording
              title={recording.title}
              length={recording.length}
              releaseDate={recording.releaseDate}
              tags={recording.tags}
              rating={recording.rating}
              comments={recording.comments}
              artists={recording.artists}></Recording>
          </ListGroupItem>)}
        </ListGroup>
      </Container>
    )
  }
};

RecordingsList.propTypes = {
};

RecordingsList.defaultProps = {};

export default RecordingsList;
