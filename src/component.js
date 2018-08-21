export default (text = "Hello world1234567") => {
    const element = document.createElement("div");

    element.innerHTML = text;

    return element;
};