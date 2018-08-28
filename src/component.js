Promise.resolve().finally();

class MySpecialClass {

}

export default (text = "11112221") => {
    const element = document.createElement("div");

    element.innerHTML = text;
    new MySpecialClass();
    return element;
};

