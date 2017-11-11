import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';
import { Link } from '../../../styles/Sidenav';
import { Widget, Description, Time, WidgetWrapper } from '../../../styles/Widgets';

class TwitterWidget extends Component {
  static propTypes = {
    data: PropTypes.shape({
      twitter: PropTypes.object
    })
  }

  static defaultProps = {
    data: {
      twitter: {
        tweets: []
      }
    }
  }

  state = {
    tweets: []
  }

  componentWillReceiveProps({ data: { twitter = { tweets: [null] } } }) {
    const [tweet] = twitter.tweets;
    this.updateTweets(tweet || null);
  }

  updateTweets = (tweet) => {
    if (!tweet) this.setState(() => ({ tweets: [] }));
    else {
      this.setState(state => ({ tweets: [...state.tweets, tweet] }));
      this.setState(state => ({ tweets: [state.tweets[state.tweets.length - 1]] }));
    }
  }

  render = () => {
    const { tweets = [] } = this.state;
    return (
      <TransitionGroup component={WidgetWrapper}>
        {tweets.map(({ url = '//twitter.com/ChrisW_B/', message = '', reltime = '' }) => (
          <Transition key={message} timeout={1000}>
            { status => (
              <Widget status={status}>
                <Description dangerouslySetInnerHTML={{ __html: message }} /> {/* eeep! */}
                <Time>
                  <Link href={url} title={reltime}>{reltime}</Link>
                </Time>
              </Widget>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}

export default TwitterWidget;