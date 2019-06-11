import React from 'react';
import {
  Box, Text, Button, Grid, Grommet, TextArea,
} from 'grommet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { wsConnect, leaveGame } from '../modules/websocket';
import { getGame } from '../modules/game';
import { getMessages, newMessage } from '../modules/message';
import withAuth from '../hocs/authWrapper';

const theme = {
  button: {
    padding: {
      horizontal: '6px',
    },
  },
};

class Game extends React.Component {
  state = {
    message: '',
  };

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      this.connectAndJoin();
    }
  }

  connectAndJoin = async () => {
    const { id, dispatch } = this.props;
    const host = `ws://127.0.0.1:8000/ws/game/${id}?token=${localStorage.getItem('token')}`;
    await dispatch(wsConnect(host));
    dispatch(getGame(id));
    dispatch(getMessages(id));
  };

  leaveGame = () => {
    const { id, dispatch, history } = this.props;
    dispatch(leaveGame(id));
    history.push('/games');
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ message: value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { message } = this.state;
    dispatch(newMessage(message));
  };

  render() {
    const { id, messages } = this.props;
    const { message } = this.state;
    if (id) {
      return (
        <React.Fragment>
          <Box
            round="xsmall"
            margin="medium"
            width="600px"
            pad="medium"
            elevation="medium"
            background="accent-2"
            overflow={{ horizontal: 'hidden', vertical: 'scroll' }}
          >
            {Array.isArray(messages.messages)
              && messages.messages.map(message => (
                <Grid key={message.id} columns={{ count: 2 }}>
                  <Grommet theme={theme}>
                    <Text>
                      {' '}
                      {message.message_type === 'action' ? null : `${message.user.username}:`}
                      {message.message}
                    </Text>
                  </Grommet>
                </Grid>
              ))}
            <Grid gap="small" columns={['450px', 'xsmall']}>
              <Box>
                <TextArea onChange={this.handleChange} value={message} />
              </Box>
              <Box justify="center" align="center" alignContent="center">
                <Button onClick={this.handleSubmit} label="send" />
              </Box>
            </Grid>
          </Box>
          <Button onClick={this.leaveGame} label="leave game" />
        </React.Fragment>
      );
    }
    return `${<Text> LOADING </Text>}`;
  }
}

Game.propTypes = {
  id: PropTypes.string,
  dispatch: PropTypes.func,
  joinedUser: PropTypes.string,
  history: PropTypes.func,
};

Game.defaultProps = {
  id: PropTypes.string,
  dispatch: PropTypes.func,
  joinedUser: PropTypes.null,
  history: PropTypes.func,
};

const s2p = (state, ownProps) => ({
  id: ownProps.match && ownProps.match.params.id,
  messages: state.messages,
  username: state.auth.username,
  socket: state.socket.host,
  joinedUser: state.socket.user,
  users: state.socket.users,
});
export default withAuth(connect(s2p)(Game));