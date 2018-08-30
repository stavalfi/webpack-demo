import Name from "./Name";

const React = require("react");
const ReactDOM = require("react-dom");

export default class Welcome extends React.Component {
  render() {
    return <div>
      Hello, <Name name={Math.random()}/>1112
      </div>;
  }
}