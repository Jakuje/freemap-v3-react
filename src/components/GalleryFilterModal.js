/* eslint-disable jsx-a11y/no-static-element-interactions */ // prevented warning in bootstrap code

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from 'react-bootstrap/lib/Modal';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import { galleryFilter } from 'fm3/propTypes';

import { gallerySetFilter, galleryHideFilter } from 'fm3/actions/galleryActions';

class GalleryViewerModal extends React.Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    filter: galleryFilter.isRequired,
    onClose: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired).isRequired,
  }

  constructor(props) {
    super(props);
    const {
      tag, userId, takenAtFrom, takenAtTo, createdAtFrom, createdAtTo, ratingFrom, ratingTo,
    } = props.filter;
    this.state = {
      tag: tag || '',
      userId: typeof userId === 'number' ? userId.toString() : '',
      takenAtFrom: takenAtFrom instanceof Date ? takenAtFrom.toISOString().replace(/T.*/, '') : '',
      takenAtTo: takenAtTo instanceof Date ? takenAtTo.toISOString().replace(/T.*/, '') : '',
      createdAtFrom: createdAtFrom instanceof Date ? createdAtFrom.toISOString().replace(/T.*/, '') : '',
      createdAtTo: createdAtTo instanceof Date ? createdAtTo.toISOString().replace(/T.*/, '') : '',
      ratingFrom: typeof ratingFrom === 'number' ? ratingFrom.toString() : '',
      ratingTo: typeof ratingTo === 'number' ? ratingTo.toString() : '',
    };
  }

  handleTagChange = (e) => {
    this.setState({ tag: e.target.value });
  }

  handleUserIdChange = (e) => {
    this.setState({ userId: e.target.value });
  }

  handleTakenAtFromChange = (e) => {
    this.setState({ takenAtFrom: e.target.value });
  }

  handleTakenAtToChange = (e) => {
    this.setState({ takenAtTo: e.target.value });
  }

  handleCreatedAtFromChange = (e) => {
    this.setState({ createdAtFrom: e.target.value });
  }

  handleCreatedAtToChange = (e) => {
    this.setState({ createdAtTo: e.target.value });
  }

  handleRatingFromChange = (e) => {
    this.setState({ ratingFrom: e.target.value });
  }

  handleRatingToChange = (e) => {
    this.setState({ ratingTo: e.target.value });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.props.onOk({
      tag: this.state.tag ? this.state.tag : null,
      userId: nn(this.state.userId ? parseInt(this.state.userId, 10) : null),
      takenAtFrom: nt(this.state.takenAtFrom ? new Date(this.state.takenAtFrom) : null),
      takenAtTo: nt(this.state.takenAtTo ? new Date(this.state.takenAtTo) : null),
      createdAtFrom: nt(this.state.createdAtFrom ? new Date(this.state.createdAtFrom) : null),
      createdAtTo: nt(this.state.createdAtTo ? new Date(this.state.createdAtTo) : null),
      ratingFrom: nn(this.state.ratingFrom ? parseFloat(this.state.ratingFrom, 10) : null),
      ratingTo: nn(this.state.ratingTo ? parseFloat(this.state.ratingTo, 10) : null),
    });
  }

  handleEraseClick = () => {
    this.setState({
      tag: '',
      userId: '',
      takenAtFrom: '',
      takenAtTo: '',
      ratingFrom: '',
      ratingTo: '',
    });
  }

  render() {
    const { onClose, tags, users } = this.props;

    return (
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filter fotografií</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.handleFormSubmit}>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Tag</ControlLabel>
              <FormControl
                componentClass="select"
                value={this.state.tag}
                onChange={this.handleTagChange}
              >
                <option value={null} />
                {tags.map(({ name, count }) => <option key={name} value={name}>{name} ({count})</option>)}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Autor</ControlLabel>
              <FormControl
                componentClass="select"
                value={this.state.userId}
                onChange={this.handleUserIdChange}
              >
                <option value={null} />
                {users.map(({ id, name, count }) => <option key={id} value={id}>{name} ({count})</option>)}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Dátum nahratia</ControlLabel>
              <InputGroup>
                <FormControl
                  type="date"
                  value={this.state.createdAtFrom}
                  onChange={this.handleCreatedAtFromChange}
                />
                <InputGroup.Addon> - </InputGroup.Addon>
                <FormControl
                  type="date"
                  value={this.state.createdAtTo}
                  onChange={this.handleCreatedAtToChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Dátum fotenia</ControlLabel>
              <InputGroup>
                <FormControl
                  type="date"
                  value={this.state.takenAtFrom}
                  onChange={this.handleTakenAtFromChange}
                />
                <InputGroup.Addon> - </InputGroup.Addon>
                <FormControl
                  type="date"
                  value={this.state.takenAtTo}
                  onChange={this.handleTakenAtToChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Hodnotenie</ControlLabel>
              <InputGroup>
                <FormControl
                  type="number"
                  min={1}
                  max={this.state.ratingTo || 5}
                  step="any"
                  value={this.state.ratingFrom}
                  onChange={this.handleRatingFromChange}
                />
                <InputGroup.Addon> - </InputGroup.Addon>
                <FormControl
                  type="number"
                  min={this.state.ratingFrom || 1}
                  max={5}
                  step="any"
                  value={this.state.ratingTo}
                  onChange={this.handleRatingToChange}
                />
              </InputGroup>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">
              <Glyphicon glyph="ok" /> Použiť
            </Button>
            <Button type="button" onClick={this.handleEraseClick}>
              <Glyphicon glyph="erase" /> Vyčistiť
            </Button>
            <Button type="button" onClick={onClose}>
              <Glyphicon glyph="remove" /> Zrušiť
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

function nn(value) {
  return Number.isNaN(value) ? null : value;
}

function nt(value) {
  return value instanceof Date && !Number.isNaN(value) ? value : null;
}

export default connect(
  state => ({
    filter: state.gallery.filter,
    users: state.gallery.users,
    tags: state.gallery.tags,
  }),
  dispatch => ({
    onClose() {
      dispatch(galleryHideFilter());
    },
    onOk(filter) {
      dispatch(gallerySetFilter(filter));
    },
  }),
)(GalleryViewerModal);
