export default (text = "1") => {
    const element = document.createElement("div");

    element.innerHTML = text;

    return element;
};

let x;
