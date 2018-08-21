export default (text = "Hello123") => {
    const element = document.createElement("div");

    element.innerHTML = text;

    return element;
};