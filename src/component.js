import "react";
import "react-dom";

Promise.resolve().finally();

class MySpecialClass {

}

export default (text = "123456712311117777") => {
    const element = document.createElement("button");
    element.setAttribute("id", "myButton1");
    element.onclick = () => element.innerHTML = 'clicked!!!fhgdfewfewy';
    element.innerHTML = text;
    new MySpecialClass();
    return element;
};

