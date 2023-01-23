import React from 'react';
import PropTypes from 'prop-types';
import styles from './RecordingsList.module.css';
import recordingsService from '../../../Services/recordings.service';
import { Container, Form, ListGroup, ListGroupItem, Button, Row } from 'react-bootstrap';
import Recording from '../Recording/Recording';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DeleteForm from '../../../forms/DeleteForm';
import * as Icon from "react-bootstrap-icons"
import EditForm from '../../../forms/EditForm';
import { NotificationContainer } from 'react-notifications';

class RecordingsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: '',
      recordingsbeforeFiltering:[],
      recordingsbeforeSorting:[],
      recordings: []
    }

    this.filterRecordings=this.filterRecordings.bind(this);
    this.sortRecordingsRatingAscending=this.sortByRatingAscending.bind(this);
    this.sortRecordingsRatingDescending=this.sortByRatingDescending.bind(this);
    this.sortRecordingsTitleAscending=this.sortByTitleAscending.bind(this);
    this.sortRecordingsTitleDescending=this.sortByTitleDescending.bind(this);
    this.sortRecordingsAuthorAscending=this.sortByAuthorAscending.bind(this);
    this.sortRecordingsAuthorDescending=this.sortByAuthorDescending.bind(this);
  }
  async componentDidMount(){
    const recordings = await recordingsService.getRecordings();

    this.setState({
      recordingsbeforeFiltering:recordings,
      recordingsbeforeSorting:recordings,
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

  sortByRatingAscending(e){
    const recordings=this.state.recordingsbeforeSorting.sort((recording1, recording2) => recording1.rating - recording2.rating);
    this.setState({
      recordings:recordings
    })
  }
  sortByRatingDescending(e){
    const recordings=this.state.recordingsbeforeSorting.sort((recording1, recording2) => recording2.rating - recording1.rating);
    this.setState({
      recordings:recordings
    })
  }

  sortByTitleAscending(e){
    const recordings=this.state.recordingsbeforeSorting.sort((a, b) => a.title.localeCompare(b.title));
    this.setState({
      recordings:recordings
    })
  }
  sortByTitleDescending(e){
    const recordings=this.state.recordingsbeforeSorting.sort((a, b) => b.title.localeCompare(a.title));
    this.setState({
      recordings:recordings
    })
  }

  sortByAuthorAscending(e){
    const recordings=this.state.recordingsbeforeSorting.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
    this.setState({
      recordings:recordings
    })
  }
  sortByAuthorDescending(e){
    const recordings=this.state.recordingsbeforeSorting.sort((a, b) => b.artists[0].name.localeCompare(a.artists[0].name));
    this.setState({
      recordings:recordings
    })
  }

  updateRecordingsList = (action, body) => {
    switch (action) {
      case "PUT":
        var list = this.state.recordings;
        var recordingIndex = list.findIndex(recording => recording.id === body.id);
        list[recordingIndex].title = body.title;
        list[recordingIndex].length = body.length;
        list[recordingIndex].releaseDate = body.releaseDate;
        list[recordingIndex].tags = body.tags;
        list[recordingIndex].artists = body.artists;
        list[recordingIndex].rating = body.rating;
        list[recordingIndex].comments = body.comments;
        this.setState({
          recordings: list
        });
        break;
      case "DELETE":
        var list = this.state.recordings;
        var recordingIndex = list.findIndex(recording => recording.id === body);
        list.splice(recordingIndex,1)
        this.setState({
          recordings: list
        });
        break;
      default:
        break;
    }
  }

  showEditForm(id) {
    const { recordings } = this.state;
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <div>
                    <EditForm recordings={recordings} index={id} onClose={onClose} editRecording={this.editRecording} />
                    <NotificationContainer />
                </div>
            )
        }
    })
}

  showDeleteForm(id) {
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <DeleteForm index={id} onClose={onClose} deleteRecording={this.deleteRecording} />
            )
        }
    })
  }

  editRecording = (index, s) => {
    recordingsService.editRecording(s.id, s)
    .then(response => {
      if (response.status === 200) {
        this.updateRecordingsList("PUT", s);
      }
    });
}

  deleteRecording = (id) => {
    recordingsService.deleteRecording(id)
    .then(response => {
      if(response.status === 204) {
        this.updateRecordingsList("DELETE", id)
      }
    });
  }

  render() {
    return (
      <Container>
        <Form.Control className='my-3' placeholder='Filter recordings by title' value={this.state.filterValue} onChange={this.filterRecordings}></Form.Control>
        <Row className="justify-content-md-center">
          <Button className='my-3' onClick={this.sortRecordingsRatingAscending}>Sort recordings by rating in ascending order</Button>
          <Button className='my-3' onClick={this.sortRecordingsRatingDescending}>Sort recordings by rating in descending order</Button>
        </Row>
        <Row className="justify-content-md-center">
          <Button className='my-3' onClick={this.sortRecordingsTitleAscending}>Sort recordings by title in ascending order</Button>
          <Button className='my-3' onClick={this.sortRecordingsTitleDescending}>Sort recordings by title in descending order</Button>
        </Row>
        <Row className="justify-content-md-center">
          <Button className='my-3' onClick={this.sortRecordingsAuthorAscending}>Sort recordings by author in ascending order</Button>
          <Button className='my-3' onClick={this.sortRecordingsAuthorDescending}>Sort recordings by author in descending order</Button>
        </Row>
        <ListGroup as='ul'>
          {this.state.recordings.map(recording => <ListGroupItem key={recording.id} as='li'>
            <Recording
              title={recording.title}
              length={recording.length}
              releaseDate={recording.releaseDate}
              tags={recording.tags}
              rating={recording.rating}
              comments={recording.comments}
              artists={recording.artists}>
              </Recording>
              <Row className="justify-content-md-center">
                <Button onClick={() => this.showDeleteForm(recording.id)}>
                  <Icon.Trash size={30} color="black" className="item" />
                  <i>Delete</i>
                </Button>
                <Button onClick={() => this.showEditForm(recording.id)}>
                  <Icon.Pencil size={32} color="blue" className="item" />
                  <i>Edit</i>
                </Button>
              </Row>
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
