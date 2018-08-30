import component from "./component";
import "./main.css";

document.body.appendChild(component());

if(module.hot) {
    module.hot.accept('./component.js',()=>{
        document.getElementById('myButton1').remove();
        document.body.appendChild(component());
    });
}