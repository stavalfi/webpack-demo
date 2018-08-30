import Name from "./Name";

const React = require("react");
const ReactDOM = require("react-dom");

export default class Welcome extends React.Component {
  chunk(array, amount) {
    return new Array(null, {
        length: Math.ceil(array.length / amount)
      })
      .map(Number.call, Number)
      .map(i => array.slice(i * amount, (i + 1) * amount));
  }
  concat(array) {
    return Object.keys(arguments)
      .slice(1)
      .reduce((result, param) => {
        if (Array.isArray(param))
          return result.concat(...param);
        return result.concat([param]);
      }, array);
  }
  difference(array, exclude) {
    const map = exclude.reduce((result, element) => ({
      ...result,
      [element]: element
    }), {});

    return array.filter(element=> element in map);
  }
  render() {
    return this.difference([1, 2, 3, 3], [1,3]);
  };
}