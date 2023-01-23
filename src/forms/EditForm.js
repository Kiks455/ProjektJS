import React, { Component } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import { Alert as AlertDismissable } from 'react-bootstrap';
import recordingsService from '../Services/recordings.service';
import Artist from '../classes/Artist';
import Recording from '../classes/Recording';
import { Container, Card, Row } from 'react-bootstrap';
import { Rating } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { parseISO } from 'date-fns';
import './EditForm.css';
import * as yup from 'yup';
import ValidationErrors from '../components/Recordings/Validation/ValidationErrors';
import 'react-confirm-alert/src/react-confirm-alert.css';
import PropTypes from 'prop-types';
import * as Icon from "react-bootstrap-icons"

const formSchema = yup.object().shape({
    title: yup.string().required("This field is required"),
    length: yup.number().typeError("This field is required and has to be a number")
        .positive("The number must be positive")
        .integer("The number must be an integer"),
    releaseDate: yup.date().typeError("This field is required and has to be a date")
        .default(function () {
            return new Date();
        }),
    tags: yup.string().required("This field is required"),
    rating: yup.number().typeError("This field is required")
        .positive("The number must be positive")
        .integer("The number must be an integer")
        .min(1, "The number should be equal or greater than 1")
        .max(5, "The number cannot be greater than 5"),
    comments: yup.string().required("This field is required"),
    artists: yup.string().required("This field is required"),
});

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        var r = props.recordings.filter(recording => recording.id === props.index);

        this.state = {
            recordings: props.recordings,
            id: props.index,
            indexa: 1,
            title: r[0].title,
            length: r[0].length,
            releaseDate: new Date(r[0].releaseDate),
            tags: r[0].tags.join("; "),
            rating: r[0].rating,
            comments: r[0].comments.join("; "),
            artists: r[0].artists.map(a => a.name).join("; "),
            titleErrors: [],
            lengthErrors: [],
            releaseDateErrors: [],
            tagsErrors: [],
            ratingErrors: [],
            commentsErrors: [],
            artistsErrors: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount(){
        await recordingsService.getRecordings()
            .then(async recordings => {
                await this.setState({
                    recordings: recordings
                })
                const artists = recordings.map(r => r.artists).flat();
                const uniqueArtists = artists.filter((item, index) => {
                    return artists.map(item => item.id).indexOf(item.id) === index;
                  });
                const aa = uniqueArtists.map(a => a.id).filter(b => b.length != 36).map(c => parseInt(c));
                const a = uniqueArtists.map(a => a.id).filter(b => b.length != 36).map(c => parseInt(c)).reduce((a, b) => Math.max(a, b), 0)+1;
                await this.setState({
                    indexa: a,
                })
            })
      }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeDate(date) {
        if (date) {
            date.setHours((-1 * date.getTimezoneOffset()) / 60);
            const formattedDate = date.toISOString().slice(0,10);
            const parsedDate = parseISO(formattedDate);
            this.setState({ releaseDate: parsedDate });
        }
    }

    async handleSubmit(event) {
        const isFormValid = await this.validateForm();
        if (!isFormValid) {
            event.preventDefault();
        }
        if (isFormValid) {
            const artists = this.state.recordings.map(r => r.artists).flat();
            const uniqueArtists = artists.filter((item, index) => {
                return artists.map(item => item.id).indexOf(item.id) === index;
            });
            const ar = this.state.artists.split(';').map(artist => artist.trim())
            const artistss = []
            for (const a of ar) {
                const aa = uniqueArtists.filter(d => d.name == a)
                if(aa.length == 0) {
                    artistss.push(new Artist(this.state.indexa.toString(), a));
                    let x = this.state.indexa+1;
                    await this.setState({
                        indexa: x
                    })
                }
                else {
                    artistss.push(aa[0]);
                }
            }
            if (this.state.releaseDate) {
                this.state.releaseDate.setHours((-1 * this.state.releaseDate.getTimezoneOffset()) / 60);
            }
            const formattedDate = this.state.releaseDate.toJSON().slice(0,10);
            const recording = new Recording(this.state.id.toString(), this.state.title, parseInt(this.state.length), formattedDate, this.state.tags.split(';').map(tag => tag.trim()), artistss, parseInt(this.state.rating), this.state.comments.split(';').map(comment => comment.trim()))

            this.props.editRecording(this.state.id, recording);
            this.props.onClose();
        }
    }

    async validateForm() {

        const titleErrors = [];
        const lengthErrors = [];
        const releaseDateErrors = [];
        const tagsErrors = [];
        const ratingErrors = [];
        const commentsErrors = [];
        const artistsErrors = [];

        let isFormValid = true;

        await formSchema.validate({
            title: this.state.title,
            length: this.state.length,
            releaseDate: this.state.releaseDate,
            tags: this.state.tags,
            rating: this.state.rating,
            comments: this.state.comments,
            artists: this.state.artists
        }, { abortEarly: false })
            .catch(err => {
                isFormValid = false;

                err.inner.forEach((f, index) => {
                    const errorMessage = {
                        id: index,
                        message: f.message
                    };

                    if (f.path === 'title') {
                        titleErrors.push(errorMessage);
                    }
                    else if (f.path === 'length') {
                        lengthErrors.push(errorMessage);
                    }
                    else if (f.path === 'releaseDate') {
                        releaseDateErrors.push(errorMessage);
                    }
                    else if (f.path === 'tags') {
                        tagsErrors.push(errorMessage);
                    }
                    else if (f.path === 'rating') {
                        ratingErrors.push(errorMessage);
                    }
                    else if (f.path === 'comments') {
                        commentsErrors.push(errorMessage);
                    }
                    else if (f.path === 'artists') {
                        artistsErrors.push(errorMessage);
                    }
                });

                this.setState({
                    titleErrors: titleErrors,
                    lengthErrors: lengthErrors,
                    releaseDateErrors: releaseDateErrors,
                    tagsErrors: tagsErrors,
                    ratingErrors: ratingErrors,
                    commentsErrors: commentsErrors,
                    artistsErrors: artistsErrors
                });
            }
            )

        return isFormValid;
    }

    render() {
        const { index, recordings, editRecording, onClose } = this.props;
        var r = recordings.filter(recording => recording.id === index);
        return (
            <Container className="justify-content-md-center" style={{width: "200%", margin: "0 auto"}}><br></br>
            <Card bg='info'>
                <Card.Header style={{fontSize: "24px", fontWeight: "bold"}} className='text-center'>
                    Edit recording
                    <span className='closeButton'>
                        <Icon.XCircleFill color="dimgray" size={18} onClick={() => onClose()} />
                    </span>
                </Card.Header>
                <Card.Body>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Title</FormLabel></Row>
                            <FormControl style={{width: "80%", margin: "0 auto"}} type="text" name="title" id="title" onChange={this.handleChange} value={this.state.title} />
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.titleErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Length</FormLabel></Row>
                            <FormControl style={{width: "80%", margin: "0 auto"}} type="number" name="length" id="length" onChange={this.handleChange} value={this.state.length} />
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.lengthErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Release Date  (format 'YYYY-MM-DD')</FormLabel></Row>
                            <Row style={{width: "18%", margin: "0 auto"}}><DatePicker name="releaseDate" id="releaseDate" dateFormat="yyyy-MM-dd" selected={this.state.releaseDate} onChange={this.handleChangeDate} /></Row>
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.releaseDateErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Tags (separate elements with ";")</FormLabel></Row>
                            <FormControl style={{width: "80%", margin: "0 auto"}} type="text" name="tags" id="tags" onChange={this.handleChange} value={this.state.tags} />
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.tagsErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Rating</FormLabel></Row>
                            <Row className="justify-content-md-center"><Rating type="number" name="rating" id="rating" onChange={this.handleChange} value={parseInt(this.state.rating)} /></Row>
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.ratingErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Comments (separate elements with ";")</FormLabel></Row>
                            <FormControl as="textarea" rows="3" style={{width: "80%", margin: "0 auto"}} type="text" name="comments" id="comments" onChange={this.handleChange} value={this.state.comments} />
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.commentsErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="justify-content-md-center"><FormLabel>Artists (separate elements with ";")</FormLabel></Row>
                            <FormControl style={{width: "80%", margin: "0 auto"}} type="text" name="artists" id="artists" onChange={this.handleChange} value={this.state.artists} />
                            <Row className="justify-content-md-center"><FormLabel></FormLabel><ValidationErrors errorMessages={this.state.artistsErrors}></ValidationErrors></Row>
                        </FormGroup>
                        <Row className="justify-content-md-center"><Button type="submit" onClick={() => this.handleSubmit}>Edit Recording</Button></Row>
                    </form>
                </Card.Body>
            </Card>
            </Container>
        );
    }
}

EditForm.propTypes = {
    index: PropTypes.string,
    recordings: PropTypes.array,
    onClose: PropTypes.func,
    editRecording: PropTypes.func,
};
  
EditForm.defaultProps = {};

export default EditForm;