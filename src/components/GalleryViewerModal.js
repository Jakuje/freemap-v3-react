import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'fm3/components/FontAwesomeIcon';

import Modal from 'react-bootstrap/lib/Modal';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Image from 'react-bootstrap/lib/Image';

import { gallerySetImages, gallerySetActiveImageId, galleryShowOnTheMap }
  from 'fm3/actions/galleryActions';

import 'fm3/styles/gallery.scss';

const dateFormat = new Intl.DateTimeFormat('sk');

class GalleryViewerModal extends React.Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    activeImageId: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onImageSelect: PropTypes.func.isRequired,
    onShowOnTheMap: PropTypes.func.isRequired,
  }

  handlePreviousClick = (e) => {
    e.preventDefault();

    const { images, activeImageId, onImageSelect } = this.props;
    const index = images.findIndex(({ id }) => id === activeImageId);
    if (index > 0) {
      onImageSelect(images[index - 1].id);
    }
  }

  handleNextClick = (e) => {
    e.preventDefault();
    const { images, activeImageId, onImageSelect } = this.props;
    const index = images.findIndex(({ id }) => id === activeImageId);
    if (index + 1 < images.length) {
      onImageSelect(images[index + 1].id);
    }
  }

  render() {
    const { images, activeImageId, onClose, onShowOnTheMap } = this.props;
    const index = activeImageId ? images.findIndex(({ id }) => id === activeImageId) : -1;
    const { path, title, description, author, createdAt } = images[index];

    return (
      <Modal show onHide={onClose} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>
            Obrázky {title && `:: ${title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="carousel">
            <div className="item active">
              <a
                href={`http://www.freemap.sk/upload/gallery/${path}`}
                target="freemap_gallery_image"
              >
                <Image
                  className="gallery-image"
                  // src={`http://www.freemap.sk/lib/image.php?width=558&height=558&filename=upload/gallery/${path}`}
                  src={`http://www.freemap.sk/upload/gallery/${path}`}
                  alt={title}
                />
              </a>
            </div>
            <a
              className={`left carousel-control ${index < 1 ? 'disabled' : ''}`}
              onClick={this.handlePreviousClick}
            >
              <Glyphicon glyph="chevron-left" />
            </a>
            <a
              className={`right carousel-control ${index >= images.length - 1 ? 'disabled' : ''}`}
              onClick={this.handleNextClick}
            >
              <Glyphicon glyph="chevron-right" />
            </a>
          </div>
          <p>
            <br />
            Nahral <b>{author}</b> dňa <b>{dateFormat.format(createdAt)}</b>
            {description && `: ${description}`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onShowOnTheMap}><FontAwesomeIcon icon="dot-circle-o" /> Ukázať na mape</Button>
          <Button onClick={onClose}><Glyphicon glyph="remove" /> Zavrieť</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    images: state.gallery.images,
    activeImageId: state.gallery.activeImageId,
    zoom: state.map.zoom,
    pickingPosition: state.gallery.pickingPositionForId !== null,
  }),
  dispatch => ({
    onClose() {
      dispatch(gallerySetImages([]));
    },
    onShowOnTheMap() {
      dispatch(galleryShowOnTheMap());
      dispatch(gallerySetImages([]));
    },
    onImageSelect(id) {
      dispatch(gallerySetActiveImageId(id));
    },
  }),
)(GalleryViewerModal);