/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import NiCompare from './components/NiCompare/NiCompare';

const App = ({ store }) => (
  <Provider store={store}>
    <NiCompare />
  </Provider>
);

App.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
