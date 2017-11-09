import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PropTypes } from 'prop-types';
import { TransitionGroup, Transition } from 'react-transition-group';
import { Widget, Description, WidgetWrapper } from './Widgets.style';

const query = gql `
  {
    lastfm {
      nowplaying {
        title artist
      }
    }
  }
`;

const queryOptions = {
  options: {
    pollInterval: 1000 * 30,
    ssr: false
  }
};

class LastFmWidget extends Component {
  static propTypes = {
    data: PropTypes.shape({
      lastfm: PropTypes.object
    })
  }

  static defaultProps = {
    data: {
      lastfm: {
        nowplaying: null
      }
    }
  }

  state = {
    songs: []
  }

  componentWillReceiveProps = ({ data: { lastfm } }) =>
    this.updateSong(lastfm.nowplaying);

  updateSong = (nowplaying) => {
    if (!nowplaying) this.setState(state => ({ songs: [...state.songs, null] }));
    else this.setState(state => ({ songs: [...state.songs, `♫ ${nowplaying.title} by ${nowplaying.artist}`] }));
    this.setState(state => ({ songs: [state.songs[state.songs.length - 1]] }));
  }

  render = () => {
    const { songs = [] } = this.state;
    return (
      <TransitionGroup component={WidgetWrapper}>
        {songs.map(song => (
          <Transition key={song} timeout={1000}>
            { status => (
              <Widget status={status}>
                <Description>{song}</Description>
              </Widget>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}

export default graphql(query, queryOptions)(LastFmWidget);