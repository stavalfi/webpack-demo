import { render } from 'react-dom';
import Home from "./components/home";
const React = require("react");
const ReactDOM = require("react-dom");

ReactDOM.render(
    <Home/>,
    document.getElementById('root')
  );

  module.hot.accept('./components/home.js', () => {
    render(<Home/>, document.getElementById('root'));
  });