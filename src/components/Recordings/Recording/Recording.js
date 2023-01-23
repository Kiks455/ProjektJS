import React from 'react';
import PropTypes from 'prop-types';
import styles from './Recording.module.css';
import { Container, Row, Col, Card, Button, Tabs, Tab, Image, ListGroup, ListGroupItem, Badge } from 'react-bootstrap'
import { propTypes } from 'react-bootstrap/esm/Image';
import { MDBIcon } from 'mdb-react-ui-kit'
import { Rating } from '@mui/material';

const Recording = (props) => {
  let seconds = Math.floor((props.length / 1000));
  const minutes = Math.floor(seconds / 60);
  seconds = seconds - minutes * 60;

  return (
    <Container>
      <Card bg='info'>
        <Card.Header className='text-center'>
          {props.title}
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey="Information">
            <Tab eventKey="Information" title="Information">
              <Row>
                <Col lg={6}>
                  <Image rounded thumbnail fluid src={process.env.PUBLIC_URL + '/images/note.jpg'} alt='' roundedCircle className="my-3"></Image>
                  <Card.Text className="text-center">
                    <span>{props.releaseDate}</span>&nbsp;
                    <MDBIcon fas icon="circle" size="xs" style={{ color: "white" }} />&nbsp;
                    {seconds / 10 < 1 ?
                      <span>{minutes}:0{seconds}</span>
                      : <span>{minutes}:{seconds}</span>}
                  </Card.Text>
                </Col>
                <Col lg={6}>
                  <Card.Title className="my-3">By</Card.Title>
                  {props.artists.map(artist => <Card.Text key={artist.id}>{artist.name}</Card.Text>)}
                  <Card.Title className="my-3">Rating</Card.Title>
                  <Rating value={props.rating}></Rating>
                  <Card.Title className="my-3">Tags</Card.Title>
                  <Card.Text>
                  {props.tags.map((tag, index) => <Badge key={index} className="rounded p-2 mx-2 my-2" bg='primary'>{tag}</Badge>)}
                  </Card.Text>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey='Comments' title='Comments'>
              {props.comments.map((comment, index)=><Card.Text className='mt-2' key={index}>{comment}</Card.Text>)}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  )
};

Recording.propTypes = {
  title: PropTypes.string,
  length: PropTypes.number,
  releaseDate: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  rating: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.string),
  artists: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }))
};

Recording.defaultProps = {};

export default Recording;
