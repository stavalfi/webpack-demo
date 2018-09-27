import Name from "./Name";

const React = require("react");
const ReactDOM = require("react-dom");

export default class Welcome extends React.Component {

    // Transducers:
    // compose array methods WITHOUT creating a new array after each method invocation.
    f3() {
        // general note on operators: only the last function maybe will add the element
        // to the result-array: arrayUntilNow so it means that all the operators before
        // won't thought that parameter.
        const tap = consumer => reducing => (arrayUntilNow, currentElement) => {
            consumer(currentElement);
            return reducing(arrayUntilNow, currentElement);
        };

        const map =
            // the user give me
            mapper =>
                // i give and it is the next function to be called
                reducing =>
                    // the javascript reduce function gives me this at start and then the
                    // last function is giving me this. the arrayUntilNow will never change
                    // and only the last function may add the final element to it.
                    // the currentElement may be transformed if used inside Map.
                    (arrayUntilNow, currentElement) =>
                        reducing(arrayUntilNow, mapper(currentElement));

        const filter = predicate =>
            reducing =>
                (arrayUntilNow, currentElement) =>
                    predicate(currentElement) ?
                        reducing(arrayUntilNow, currentElement) :
                        arrayUntilNow;

        const toString = x => x + "";
        const isEven = x => x % 2 === 0;
        const addElement = (arrayUntilNow, currentElement) => [...arrayUntilNow, currentElement];

        const pipe = (...funcs) =>
            initialParam =>
                funcs.reduce((currentParam, func) => func(currentParam), initialParam);

        const transduce = (...funcs) =>
            addElementToArray =>
                elements =>
                    elements.reduce(pipe(...funcs)(addElementToArray), []);

        const addElementToArray = (arrayUntilNow, currentElement) => arrayUntilNow + currentElement;

        return transduce(
            map(toString),
            filter(isEven)
        )
        (/* fill_this_argument */)
        ([1, 2, 3, 4]);
    }

    f4(array) {
        return array.flatMap(element =>
            Array.isArray(element) ? f4(element) : [element]);
    }

    render() {
        const result = this.f3();

        console.log(result);

        return <div>
            {
                result
            }
        </div>;
    }
}


const map = mapper =>
    nextTreducing =>
        (arrayUntilNow, currentElement) =>
            nextTreducing(arrayUntilNow, mapper(currentElement));

// the user will provide them:
const multiply = number => number * 10;
const add = number => number + 1;

// the user won't provide this because it's implementation detail:
const addElementToArray = (arrayUntilNow, currentElement) => [...arrayUntilNow, currentElement];

const result1 = map(number => number * 10)(addElementToArray)(
    // the last transducer will give this parameters to this transducer:
    [], 10
);
// ([],10) -> [100]
const result2 = map(number => number * 10)(addElementToArray)([1], 8);
// ([1],8) -> [1,80]
const result3 = map(number => number * 10)(map(number => number + 1)(addElementToArray))([2], 5);
// ([2],5) -> ([2],50) -> [2,50]


const filter = predicate =>
    nextTreducing =>
        (arrayUntilNow, currentElement) =>
            predicate(currentElement) ?
                nextTreducing(arrayUntilNow, currentElement) :
                arrayUntilNow;