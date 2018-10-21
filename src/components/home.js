const React = require("react");
import * as d3 from "d3";

const fillMatrixWithPoints = (p1, p2, matrix) => {
    if (matrix.length === 0 || matrix[0].length === 0)
        return matrix;

    // there is at least one cell in the matrix.

    const width = p2.x - p1.x;
    const height = p2.y - p1.y;

    const cellWidth = width / matrix.length;
    const cellHeight = height / matrix[0].length;

    // Note: the +-1 in the following code is to prevent a situation where a point is inside more then one box!

    // top left corner.
    matrix[0][0].p1 = {
        x: p1.x,
        y: p2.y - cellHeight + 1
    };
    // down right corner.
    matrix[0][0].p2 = {
        x: p1.x + cellWidth - 1,
        y: p2.y
    };
    matrix[0][0].index = 0 + "," + 0;

    for (let j = 1; j < matrix.length; j++) {
        matrix[j][0].index = 0 + "," + j;
        matrix[j][0].p1 = {
            x: matrix[j - 1][0].p2.x + 1,
            y: matrix[j - 1][0].p1.y,
        };
        matrix[j][0].p2 = {
            x: matrix[j][0].p1.x + cellWidth - 1,
            y: matrix[j][0].p1.y + cellHeight
        };
    }

    for (let i = 1; i < matrix[0].length; i++) {
        matrix[0][i].index = i + "," + 0;
        matrix[0][i].p1 = {
            x: matrix[0][i - 1].p2.x + 1,
            y: matrix[0][i - 1].p1.y - cellHeight
        };
        matrix[0][i].p2 = {
            x: matrix[0][i].p1.x + cellWidth - 1,
            y: matrix[0][i].p1.y + cellHeight - 1
        };
    }

    for (let j = 1; j < matrix.length; j++)
        for (let i = 1; i < matrix[j].length; i++) {
            matrix[j][i].index = i + "," + j;
            matrix[j][i].p1 = {
                x: matrix[j][i - 1].p1.x,
                y: matrix[j - 1][i].p1.y
            };
            matrix[j][i].p2 = {
                x: matrix[j][i - 1].p2.x,
                y: matrix[j - 1][i].p2.y
            };
        }

    return matrix;
};


// param:
// array: an array of heights.
//
// return: the amount of water we can save in all the ruptures.
function waterfall(array) {
    return sumRuptures(array, [], 0);

    // params:
    // array: the array to look for ruptures. (Sometimes I will send different array)
    // ruptures: array of all the ruptures I found so far.
    // startIndexOfRupture: the start index to look for the next rupture.
    //
    // return: the amount of water we can save in all the ruptures.
    function sumRuptures(array, ruptures, startIndexOfRupture) {
        if (array.length <= 2)
            return ruptures;

        if (startIndexOfRupture >= array.length - 1)
            return ruptures;

        const leftHeightOfRupture = array[startIndexOfRupture];

        const isEndOfRupture = index => leftHeightOfRupture > array[index];

        // the function returns the first index which fulfills: leftHeightOfRupture > array[index] && leftHeightOfRupture <= array[index+1]
        // reminder: array[index+1] is the end of the rupture.
        // it means that, that index is the prev before the last index of the current rupture:
        // [...,startIndexOfRupture,...,*almostEndIndexOfRupture*,last-index-of-rupture,...].
        const almostEndIndexOfRupture = findLastIndexBy(array, startIndexOfRupture + 1, array.length, isEndOfRupture);

        // four possible outcomes:
        // 1. almostEndIndexOfRupture === array.length-2 ==> the last cell of the array is the highest ==>
        //    we calculate such that the left side is the highest point.
        // 2. almostEndIndexOfRupture === array.length-1 ==> the last cell of the array is NOT the highest =>
        //    we can flip that sub array and then we are in option 1 or 3.
        //    (3 if we will have multiple ruptures in this rupture).
        // 3. almostEndIndexOfRupture < array.length-2 ==> we calculate such that the left side is the highest point.
        // 4. almostEndIndexOfRupture === -1 ==> the next number was bigger then the start of the rupture. so there is no rupture.

        if (almostEndIndexOfRupture === -1) {
            // option: 4: the next number was bigger then the start of the rupture. so there is no rupture.
            // I will try to loop the next rupture from this position:
            return sumRuptures(array, ruptures, startIndexOfRupture + 1);
        }

        if (almostEndIndexOfRupture === array.length - 1) {
            // option: 2: the last cell of the array is NOT the highest =>
            // we can flip that sub array and then we are in option 1 or 3.
            // (3 if we will have multiple ruptures in this rupture).

            // *Note*: I can build the array with much better speed but this is for test-readability only!!!
            const reversedPartialArray = array.slice(startIndexOfRupture, almostEndIndexOfRupture + 1).reverse();
            const rupturesFromPartialArray = sumRuptures(reversedPartialArray, [], 0)
            // I sent the partial array in reverse so I will receive the results in reverse.
                .reverse()
                // we need to add offset to every index because we calculated the ruptures from a partial array.
                .map(rupture => ({
                    ...rupture,
                    from: startIndexOfRupture + (reversedPartialArray.length - 1 - rupture.to),
                    to: startIndexOfRupture + (reversedPartialArray.length - 1 - rupture.from)
                }));
            return [...ruptures, ...rupturesFromPartialArray];
        }

        // options: 1,3: we calculate such that the left side is the highest point.
        // we look at all the cells such that: [startIndexOfRupture + 1 ,almostEndIndexOfRupture]

        const waterInRupture = array.slice(startIndexOfRupture + 1, almostEndIndexOfRupture + 1)
            .map(height => leftHeightOfRupture - height)
            .reduce((sum, height) => sum + height, 0);

        const rupture = {
            from: startIndexOfRupture,
            to: almostEndIndexOfRupture + 1,
            maxHeight: leftHeightOfRupture,
            water: waterInRupture
        };

        // we search for the next rupture and calculate how much water it will save.
        return sumRuptures(array, [...ruptures, rupture], almostEndIndexOfRupture + 1);
    }
}

// find the last index from left to right that matches the predicate.
// exclusive from and inclusive to: [from,to).
const findLastIndexBy = (array, from, to, predicate) => {
    if (array.length === 0 ||
        0 > from ||
        to > array.length ||
        !predicate(from))
        return -1;

    for (let k = from; k < to; k++)
        if (predicate(k) && !predicate(k + 1))
            return k;

    const lastIndex = to - 1;
    if (predicate(lastIndex))
        return lastIndex;
};

const updateMovementFunctions = matrix => {
    for (let j = 1; j < matrix.length - 1; j++)
        for (let i = 0; i < matrix[j].length; i++) {
            if (matrix[j][i].isWater) {
                // x range - depends if the water can go to the box in left or to the box in right.
                if (matrix[j][i].canGoLeft && matrix[j][i].canGoRight)
                    matrix[j][i].calculateX = (boxStartX, x, waterRadius, boxWidth) => x;

                if (!matrix[j][i].canGoLeft && matrix[j][i].canGoRight)
                    matrix[j][i].calculateX = (boxStartX, x, waterRadius, boxWidth) =>
                        Math.max(boxStartX + waterRadius, x);

                if (matrix[j][i].canGoLeft && !matrix[j][i].canGoRight)
                    matrix[j][i].calculateX = (boxStartX, x, waterRadius, boxWidth) =>
                        Math.min(x, boxStartX + boxWidth - waterRadius);

                if (!matrix[j][i].canGoLeft && !matrix[j][i].canGoRight)
                    matrix[j][i].calculateX = (boxStartX, x, waterRadius, boxWidth) =>
                        Math.max(boxStartX + waterRadius, Math.min(boxStartX + boxWidth - waterRadius, x));

                // y range - depends if the water can go to the box in down or to the box in up.
                if (matrix[j][i].canGoDown && matrix[j][i].canGoUp)
                    matrix[j][i].calculateY = (boxStartY, y, waterRadius, boxHeight) => y;

                if (!matrix[j][i].canGoDown && matrix[j][i].canGoUp)
                    matrix[j][i].calculateY = (boxStartY, y, waterRadius, boxHeight) =>
                        Math.max(boxStartY - waterRadius, y);

                if (matrix[j][i].canGoDown && !matrix[j][i].canGoUp)
                    matrix[j][i].calculateY = (boxStartY, y, waterRadius, boxHeight) =>
                        Math.min(y, boxStartY + boxHeight - waterRadius);

                if (!matrix[j][i].canGoDown && !matrix[j][i].canGoUp)
                    matrix[j][i].calculateY = (boxStartY, y, waterRadius, boxHeight) =>
                        Math.max(boxStartY - waterRadius, Math.min(boxStartY + boxHeight - waterRadius, y));
            }
        }
    return matrix;
};

const updateReachableByDirection = matrix => {
    for (let j = 1; j < matrix.length - 1; j++)
        for (let i = 0; i < matrix[j].length; i++)
            if (matrix[j][i].isWater) {
                if (i === 0)
                    matrix[j][i].canGoDown = false;
                else
                    matrix[j][i].canGoDown = matrix[j][i - 1].isReachable;
                if (i === matrix[j].length - 1)
                    matrix[j][i].canGoUp = true;
                else
                    matrix[j][i].canGoUp = matrix[j][i + 1].isReachable;
                matrix[j][i].canGoLeft = matrix[j - 1][i].isReachable;
                matrix[j][i].canGoRight = matrix[j + 1][i].isReachable;
            }

    return matrix;
};

// [[X,X,X],[X],[X,X,X] ==>>
//
// |2,0 X| |2,1  | |2,2 X|
// |1,0 X| |1,1  | |1,2 X|
// |0,0 X| |0,1 X| |0,2 X|

// matrix[x][y] == matrix[j][i
const buildMatrixOfHeights = heights => {
    // it will be the length of each column in the matrix.
    const maxHeight = heights.reduce((max, height) => Math.max(max, height), 0);

    const matrix = heights.map((height, j) =>
        d3.range(0, maxHeight)
            .map(i => ({
                isWall: 0 <= i && i <= height - 1,
                // I will override the following in the next section for the places the water can reach.
                isReachable: false,
                // I will override the following in the next section for the places the water can reach.
                isWater: false,
                j,
                i
            })));

    // update where there is water and how height can they jump in the air.
    const ruptures = waterfall(heights);
    ruptures.forEach(rupture =>
        d3.range(rupture.from + 1, rupture.to)
            .forEach(j => {
                // update in the following places in the matrix that there is a water there:
                d3.range(heights[j], rupture.maxHeight)
                    .forEach(i => {
                        matrix[j][i].isReachable = true;
                        matrix[j][i].isWater = true;
                    });
                // every height above the water is reachable ("water can jump above the surface and then come back"):
                d3.range(rupture.maxHeight, maxHeight)
                    .forEach(i => {
                        matrix[j][i].isReachable = true;
                    });
            }));
    return matrix;
};

const buildMatrixOfWallsAndWaters = heights => {
    return updateMovementFunctions(updateReachableByDirection(buildMatrixOfHeights(heights)));
};

const p1 = {x: 100, y: 100};
const p2 = {x: 400, y: 400};
const sourceMatrix = buildMatrixOfWallsAndWaters([3, 1, 3]);
console.log(sourceMatrix);
const matrix = fillMatrixWithPoints(p1, p2, sourceMatrix);

const newMatrix = [
    [matrix[2][0], matrix[2][1], matrix[2][2]],
    [matrix[1][0], matrix[1][1], matrix[1][2]],
    [matrix[0][0], matrix[0][1], matrix[0][2]]
];
console.log(matrix);

export default class Home extends React.Component {

    // [[X,X,X],[X],[X,X,X],[X,X] ==>>
    //
    // |2,0 X| |2,1  | |2,2 X| |2,3  |
    // |1,0 X| |1,1  | |1,2 X| |1,3 X|
    // |0,0 X| |0,1 X| |0,2 X| |0,3 X|
    render() {
        return <div>
            <table>
                <tbody>
                {
                    newMatrix.map((column, j) =>
                        <tr key={j}>
                            {
                                column.map((cell, i) =>
                                    <td key={i}>
                                        {cell.isWall ? "WALL" : cell.isWater ? "WATER" : ""}
                                        <br/>
                                        {cell.index}
                                        <br/>
                                        <b>p1: {cell.p1.x},{cell.p1.y}</b>......p4: {cell.p2.x},{cell.p1.y} |
                                        <br/>
                                        p3: {cell.p1.x},{cell.p2.y}......<b>p2: {cell.p2.x},{cell.p2.y}</b> |
                                        _______________________
                                    </td>)
                            }
                        </tr>)
                }
                </tbody>
            </table>
        </div>;
    }
}


//
// function debounceTimeAndAmount(batchTime, maxConcurrentRequests) {
//     let lastRequest = {
//         time: new Date().getMilliseconds() - (2 * batchTime),
//         requestIndex: -1
//     };
//
//     function updateLastRequest(time, invocationTime, requestIndex) {
//         lastRequest = {
//             time,
//             invocationTime: 1
//             requestIndex
//         };
//     }
//
//     function httpGet(request) {
//
//     }
//
//     function debounce(request) {
//         const timeNow = new Date().getMilliseconds();
//         const timePassedFromLastRequest = timeNow - lastRequest.time;
//
//         if (timePassedFromLastRequest > batchTime) {
//             const invocationTime = 0;
//             const requestIndex = 0;
//             updateLastRequest(timeNow, invocationTime, requestIndex);
//             httpGet(request);
//         }
//         else {
//             // we need to check that we didn't fire more than max request in this batch.
//             if (lastRequest.requestIndex <= maxConcurrentRequests - 2) {
//                 // we can pass more requests in the last request's batch.
//
//                 // we need to find that batch and invoke this request when that batch is triggered.
//
//                 // check if the last request is running under the current batch.
//                 // if yes, then schedule the request now. else, schedule it later.
//                 if (lastRequest.invocationTime === 0) {
//                     const invocationTime = 0;
//                     const requestIndex = 0;
//                     updateLastRequest(timeNow, invocationTime, requestIndex);
//                     httpGet(request);
//                 }
//                 else {
//                     const invocationTime = lastRequest.invocationTime;
//                     const requestIndex = lastRequest.requestIndex + 1;
//                     updateLastRequest(timeNow, invocationTime, requestIndex);
//                     httpGet(request);
//                 }
//             }
//             else {
//                 // I need to schedule this request in a new batch by creating a new batch.
//             }
//         }
//
//
//         return new Promise((res, rej) => {
//             if (amountOfConcurrentRequests === maxConcurrentRequests ||
//                 // even if we can fire this request also, we may need to fire other requests before this request.
//                 waitingToBeFiredEvents.length > 0) {
//                 // if amountOfConcurrentRequests < maxConcurrentRequests && waitingToBeFiredEvents.length > 0:
//                 // then it means that the extra requests added AFTER we reached max maxConcurrentRequests of concurrent requests
//                 // so it means that some of them are already finished/timeout so those finished/timeout requests
//                 // will invoke the rest of the waiting requests just about now.
//                 handleRejection({request, res, rej});
//             }
//             else {
//                 amountOfConcurrentRequests++;
//                 if (amountOfConcurrentRequests === 1) {
//                     setTimeout(() =>
//                             firedRequests.filter(firedRequest => !firedRequest.finished)
//                                 .forEach(firedRequest => {
//                                     firedRequest.finished = true;
//                                     firedRequest.rej("batch-timeout");
//                                 })
//
//                         , time);
//                 }
//                 fire({request, res, rej, amountOfBatchesUntilNow});
//             }
//         });
//     }
//
//     return debounce;
// }


// function timeoutPromise(time) {
//     return new Promise((res, rej) => setTimeout(() => rej('timeout'), time));
// }
//
// function httpGet(request) {
//     if (request % 2 === 0)
//         return Promise.resolve(request)
//             .then(request => {
//                 console.log(new Date() + ", request: " + request);
//                 return request;
//             });
//
//     return new Promise(res => setTimeout(() => res(request), 2 * 1000))
//         .then(request => {
//             console.log(new Date() + ", request-timeout: " + request);
//             return request;
//         });
// }
//
// function debounceTime(time) {
//     let waitingToBeFiredEvents = [];
//     let lastTime = new Date().getTime() - 2 * time;
//
//     function handleRejection({request, res, rej}) {
//         waitingToBeFiredEvents = [
//             ...waitingToBeFiredEvents,
//             {
//                 request,
//                 res,
//                 rej
//             }
//         ];
//     }
//
//     function fire({request, res, rej}) {
//         const response = httpGet(request);
//         const timeout = timeoutPromise(time);
//
//         const result = Promise.race([response, timeout]);
//         result.then(res);
//         result.catch(rej);
//
//         timeout.catch(() => {
//             if (waitingToBeFiredEvents.length > 0) {
//                 const nextRequestToFire = waitingToBeFiredEvents[0];
//                 waitingToBeFiredEvents = waitingToBeFiredEvents.slice(1);
//                 lastTime = new Date().getTime();
//                 fire(nextRequestToFire);
//             }
//         });
//     }
//
//     function debounce(request) {
//         return new Promise((res, rej) => {
//             const timeNow = new Date().getTime();
//
//             // check if I already fired a request in this second.
//             if (timeNow - lastTime <= time ||
//                 // or I didn't fired a request just yet but there are requests that needs to be sent before this one.
//                 // (there is a request that needs to be sent just about now).
//                 waitingToBeFiredEvents.length > 0) {
//                 // I was here already in this space of time so I already sent a request.
//                 // (this request will be invoked later on by the prev request timeout).
//                 handleRejection({request, res, rej});
//             }
//             else {
//                 lastTime = timeNow;
//                 fire({request, res, rej});
//             }
//         });
//     }
//
//     return debounce;
// }
//
// function debounceAmount(amount, timeoutTime) {
//     let waitingToBeFiredEvents = [];
//     let amountOfConcurrentRequests = 0;
//
//     function handleRejection({request, res, rej}) {
//         waitingToBeFiredEvents = [
//             ...waitingToBeFiredEvents,
//             {
//                 request,
//                 res,
//                 rej
//             }
//         ];
//     }
//
//     function fire({request, res, rej}) {
//         const response = httpGet(request);
//         const timeout = timeoutPromise(timeoutTime);
//
//         const result = Promise.race([response, timeout]);
//         result.then(res);
//         result.catch(rej);
//
//         result.finally(() => {
//             if (waitingToBeFiredEvents.length > 0) {
//                 const nextRequestToFire = waitingToBeFiredEvents[0];
//                 waitingToBeFiredEvents = waitingToBeFiredEvents.slice(1);
//                 amountOfConcurrentRequests++;
//                 fire(nextRequestToFire);
//             }
//         });
//     }
//
//     function debounce(request) {
//         return new Promise((res, rej) => {
//             if (amountOfConcurrentRequests === amount ||
//                 // even if we can fire this request also, we may need to fire other requests before this request.
//                 waitingToBeFiredEvents.length > 0) {
//                 // if amountOfConcurrentRequests < amount && waitingToBeFiredEvents.length > 0:
//                 // then it means that the extra requests added AFTER we reached max amount of concurrent requests
//                 // so it means that some of them are already finished/timeout so those finished/timeout requests
//                 // will invoke the rest of the waiting requests just about now.
//                 handleRejection({request, res, rej});
//             }
//             else {
//                 amountOfConcurrentRequests++;
//                 fire({request, res, rej});
//             }
//         });
//     }
//
//     return debounce;
// }