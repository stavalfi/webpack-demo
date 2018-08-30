import Welcome from "./components/Welcome";
import "./main.css";
import { render } from 'react-dom';
const React = require("react");
const ReactDOM = require("react-dom");

ReactDOM.render(
    <Welcome/>,
    document.getElementById('root')
  );

  module.hot.accept('./components/Welcome.js', () => {
    render(<Welcome/>, document.getElementById('root'));
  });