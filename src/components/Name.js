const React = require("react");
const ReactDOM = require("react-dom");

export default class Name extends React.Component {
  render() {
    return <h1>{this.props.name}</h1>;
  }
}