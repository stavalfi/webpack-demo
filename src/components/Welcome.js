import Name from "./Name";

const React = require("react");
const ReactDOM = require("react-dom");


function GraphPaths(neighborMatrix) {
    const pathsMatrix = new Array(neighborMatrix.length);
    const costsMatrix = new Array(neighborMatrix.length);
    for (let i = 0; i < neighborMatrix.length; i++) {
        pathsMatrix[i] = new Array(neighborMatrix.length);
        costsMatrix[i] = new Array(neighborMatrix.length);
    }

    for (let i = 0; i < neighborMatrix.length; i++)
        for (let j = 0; j < neighborMatrix.length; j++) {
            costsMatrix[i][j] = neighborMatrix[i][j];
            if (costsMatrix[i][j] < Infinity)
                pathsMatrix[i][j] = [i + 1, j + 1];
            else
                pathsMatrix[i][j] = [];
        }

    for (let i = 0; i < neighborMatrix.length; i++)
        for (let j = 0; j < neighborMatrix.length; j++)
            for (let k = 0; k < neighborMatrix.length; k++)
                if (i !== j && costsMatrix[i][j] > costsMatrix[i][k] + costsMatrix[k][j]) {
                    costsMatrix[i][j] = costsMatrix[i][k] + costsMatrix[k][j];
                    pathsMatrix[i][j] = [...pathsMatrix[i][k], ...pathsMatrix[k][j].slice(1)];
                }
    return {
        pathsMatrix,
        costsMatrix
    };
}

function burningLeafs(nodeMatrix) {
    const nodes = nodeMatrix.map((node, index) => ({
        index: index,
        neighbors: node,
        count: node.length
    }));

    let radius = 0;
    let n = nodes.length;
    let nextLeafs = nodes.filter(node => node.count === 1);

    while (n >= 3) {
        x++;
        if (x > 6)
            return;
        n -= nextLeafs.length;

        nextLeafs = nextLeafs.flatMap(node => {
            node.count--;
            return node.neighbors;
        }).map(nodeIndex => {
            if (nodes[nodeIndex].count > 1)
                nodes[nodeIndex].count--;
            return nodeMatrix[nodeIndex];
        }).filter(node => node.count === 1);

        radius++;
    }
    if (n === 1)
        return {
            radius,
            diameter: radius * 2,
            nodes
        };
    return {
        radius,
        diameter: radius * 2 - 1,
        nodes
    };
}

function MinHeap(nodesAmount) {
    this.freeIndex = 0;
    this.array = new Array(nodesAmount);
    const swap = (i, j) => {
        const temp = this.array[i];
        this.array[i] = this.array[j];
        this.array[j] = temp;
    };
    const getFatherIndex = i => Math.floor(i / 2);
    const getLeftChildIndex = i => i * 2 + 1;
    const getRightChildIndex = i => i * 2 + 2;

    const goUp = i => {
        while (getFatherIndex(i) < i &&
        this.array[getFatherIndex(i)].cost > this.array[i].cost) {
            swap(getFatherIndex(i), i);
            i = getFatherIndex(i);
        }
    };

    const goDown = i => {
        while (getLeftChildIndex(i) < this.freeIndex) {
            let minBetweenChildes;
            let minChildIndex;
            if (getRightChildIndex(i) < this.freeIndex) {
                minBetweenChildes = Math.min(this.array[getLeftChildIndex(i)].cost,
                    this.array[getRightChildIndex(i)].cost);
                minChildIndex = minBetweenChildes === this.array[getLeftChildIndex(i)].cost ?
                    getLeftChildIndex(i) :
                    getRightChildIndex(i);
            }
            else {
                minBetweenChildes = this.array[getLeftChildIndex(i)].cost;
                minChildIndex = getLeftChildIndex(i);
            }

            if (this.array[i].cost > minBetweenChildes) {
                swap(i, minChildIndex);
                i = minChildIndex;
            }
        }
    };
    return {
        extract: () => {
            if (this.freeIndex === 0)
                return;

            const node = this.array[0];

            if (this.freeIndex === 1) {
                this.freeIndex = 0;
                return node;
            }

            swap(0, --this.freeIndex);

            goDown(0);
            // console.log(this.array);
            return node;
        },
        // when we update, we only decrease it's value.
        updateNode: (nodeToUpdate, newCost) => {
            const nodeIndex = this.array.findIndex(node => node.index === nodeToUpdate.index);
            if (nodeIndex === -1)
                return;

            nodeToUpdate.cost = newCost;

            goUp(nodeIndex);
            // console.log(this.array);
        },
        push: node => {
            if (this.freeIndex === this.array.length)
                return;

            this.array[this.freeIndex++] = node;
            goUp(this.freeIndex - 1);
            // console.log(this.array);
        },
        isEmpty: () => this.freeIndex === 0,
        array: this.array
    };
}

var z = 0;

function dijkstra(nodeMatrix, sourceNodeIndex) {
    const minHeap = new MinHeap(nodeMatrix.length);
    const nodes = nodeMatrix.map((node, index) => ({
        neighbors: node,
        index,
        father: undefined,
        cost: index === sourceNodeIndex ? 0 : Infinity,
        finished: false
    }));

    nodes.forEach(minHeap.push);

    while (!minHeap.isEmpty()) {
        const minNode = minHeap.extract();
        minNode.neighbors.filter(edge => !nodes[edge.nodeIndex].finished)
            .forEach(edge => {
                if (nodes[edge.nodeIndex].cost > minNode.cost + edge.cost) {
                    nodes[edge.nodeIndex].father = minNode.index;
                    minHeap.updateNode(nodes[edge.nodeIndex], minNode.cost + edge.cost);
                }
            });
        minNode.finished = true;
    }
    console.log(nodes);
}


function Queue() {
    this.array = [];
    return {
        enqueue: node => this.array = [...this.array, node],
        dequeue: () => {
            const node = this.array[0];
            this.array = this.array.slice(1);
            return node;
        },
        isEmpty: () => this.array.length === 0,
        array: this.array
    }
}

function DFS_recursion(graphArray, nodeIndex) {
    graphArray[nodeIndex].color = 1;
    graphArray[nodeIndex].neighbors.filter(neighbor => graphArray[neighbor.nodeIndex].color === 0)
        .forEach(neighbor => DFS_recursion(graphArray, neighbor.nodeIndex));
    graphArray[nodeIndex].color = 2;
}

function DFS(graph, startNodeIndex) {
    const graphArray = graph.map(neighbors => ({
        neighbors,
        color: 0
    }));

    DFS_recursion(graphArray, startNodeIndex);
    console.log(graphArray);
}

function BFS(graph, startNodeIndex) {
    const graphArray = graph.map(neighbors => ({
        neighbors,
        finished: false
    }));
    const queue = new Queue();
    queue.enqueue(graphArray[startNodeIndex]);

    while (queue.isEmpty()) {
        const node = queue.dequeue();
        node.filter(neibor => !graphArray[neibor.nodeIndex].finished)
            .forEach(queue.enqueue);
        node.finished = true;
    }
}


export default class Welcome extends React.Component {

    intersection(source, ...arrays) {
        return [arrays.map(array => array.reduce((result, element) => ({
            ...result,
            [element]: element
        }), {}))]
            .flatMap(objects =>
                source.filter(element =>
                    objects.reduce((allHaveElementUntilNow, object) =>
                        allHaveElementUntilNow && object.hasOwnProperty(element), true)));
    }

    has(object, string) {
        const keys = string.split('.');

        const has_recursion = function has_recursion(result, keys, currentIndex) {
            if (currentIndex >= keys.length)
                return true;
            if (result.hasOwnProperty(keys[currentIndex]))
                return has_recursion(result[keys[currentIndex]], keys, currentIndex + 1);
            return false;
        };

        return has_recursion(object, keys, 0);
    }

    render() {
        const compose = (...functions) => functions.reduceRight((composedFunction, currentFunction) =>
            (...params) => currentFunction(composedFunction(...params)));

        const compose2 = (...functions) => (...args) => {
            return functions.slice(0, functions.length - 1)
                .reduceRight((params, func) => func(params), functions[functions.length - 1](...args));
        };

        const pipe = compose(arg => arg + " hello!!!", arg => arg + 4, arg => arg + 3, arg => arg + 1);
        console.log(pipe(0));

        return <div>
            {
                this.intersection([1, 4], [1, 4], [4, 1, 2])
                    .map((element, index) => (
                        <div key={index}>
                            {element}
                            <br/>
                        </div>))
            }
        </div>;
    }
}