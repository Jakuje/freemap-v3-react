import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-leaflet';
import PropTypes from 'prop-types';

import MarkerWithInnerLabel from 'fm3/components/leaflet/MarkerWithInnerLabel';
import { toastsAdd } from 'fm3/actions/toastsActions';

import 'fm3/styles/changesets.scss';

const timeFormat = new Intl.DateTimeFormat('sk',
  { day: '2-digit', month: '2-digit', hour: 'numeric', minute: '2-digit' });

function Changesets({ changesets, onShowChangesetDetail }) {
  return (
    <div>
      { changesets.map(changeset => (
        <MarkerWithInnerLabel
          faIcon="pencil"
          key={changeset.id}
          faIconLeftPadding="2px"
          position={L.latLng(changeset.centerLat, changeset.centerLon)}
          onClick={() => onShowChangesetDetail(changeset)}
        >
          <Tooltip className="compact" offset={new L.Point(9, -25)} direction="right" permanent>
            <span>
              <span className="bold">{changeset.userName}</span>: {(changeset.description || '/bez popisu/').substring(0, 20)} {changeset.description && changeset.description.length >= 20 ? '...' : ''}
            </span>
          </Tooltip>
        </MarkerWithInnerLabel>
      )) }
    </div>
  );
}

Changesets.propTypes = {
  changesets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    centerLat: PropTypes.number.isRequired,
    centerLon: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    description: PropTypes.string,
    closedAt: PropTypes.instanceOf(Date).isRequired,
  })),
  onShowChangesetDetail: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    changesets: state.changesets.changesets,
  }),
  dispatch => ({
    onShowChangesetDetail(changeset) {
      const message = (
        <div>
          <dl className="dl-horizontal">
            <dt>Autor:</dt>
            <dd>
              <a
                href={`https://www.openstreetmap.org/user/${encodeURIComponent(changeset.userName)}`}
                target="_blank"
                rel="noopener noreferrer"
              >{changeset.userName}</a>
            </dd>
            <dt>Popis:</dt>
            <dd>{changeset.description || <i>bez popisu</i>}</dd>
            <dt>Čas:</dt>
            <dd>{timeFormat.format(changeset.closedAt)}</dd>
          </dl>
          <p>
            Viac detailov na{' '}
            <a
              href={`https://www.openstreetmap.org/changeset/${changeset.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              osm.org
            </a>
            {', alebo '}
            <a
              href={`https://overpass-api.de/achavi/?changeset=${changeset.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Achavi
            </a>
            .
          </p>
        </div>
      );

      dispatch(toastsAdd({
        collapseKey: 'changeset.detail',
        message,
        cancelType: ['SET_TOOL', 'CHANGESETS_REFRESH'],
        style: 'info',
      }));
    },
  }),
)(Changesets);
