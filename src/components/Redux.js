function Item() {

}

function ShoppingCart(items) {
    this.items = items;
    this.a = a;
    this.b = b;
}

const initialState = 'INITIAL_STATE';
const addItem = 'ADD_ITEM';
const removeItem = 'REMOVE_ITEM';
const editItem = 'EDIT_ITEM';
const clearShoppingCart = 'CLEAR_SHOOPING_CART';

function reduceItems(lastState, action, payload) {
    switch (action) {
        case addItem: {
            const index = lastState.items.findIndex(item => item.id === payload.item.id);
            if (index === -1)
                return new ShoppingCart([...lastState.items, {
                    ...payload.item,
                    amount: 1
                }]);
            const newItem = {
                ...lastState.items[index],
                amount: lastState.items[index].amount + 1
            };
            return new ShoppingCart([...lastState.items.slice(0, index), newItem, ...lastState.items.slice(index + 1)]);

        }
        case removeItem:
            if (!lastState.items.some(item => item.id === payload.itemId))
                return lastState;
            return new ShoppingCart(lastState.items.filter(item => item.id !== payload.itemId));
        case editItem:
            const index = lastState.items.findIndex(item => item.id === payload.item.id);
            if (index === -1)
                return lastState;
            return new ShoppingCart([...lastState.items.slice(0, index), payload.item, ...lastState.items.slice(index + 1)]);
        case clearShoppingCart:
            return new ShoppingCart([]);
    }
}

function reduce(action, lastState) {
    const newStateA = reduceA(action, lastState);
    const newStateB = reduceA(action, lastState);
    const newStateC = reduceA(action, lastState);


    return {
        newStateA,
        newStateB,
        newStateC
    }
}

function Store() {
    this.subscribers = [];
    this.lastAction = initialState;
    this.lastState = new ShoppingCart([]);
    return {
        addSubscriber: (subscriberId, update) => {
            this.subscribers.push({
                subscriberId: subscriberId,
                update: update
            });
            update(this.lastAction, this.lastState);
        },
        removeSubscriber: (subscriberId) => {
            this.subscribers = this.subscribers.filter(subscriber => subscriber.subscriberId !== subscriberId);
        },
        dispach: (action, payload) => {
            const newState = reduce(this.lastState, action, payload);
            if (newState !== this.lastState) {

                this.lastAction = action;
                this.lastState = newState;
                this.subscribers.forEach(subscriber => subscriber.update(action, newState));
            }
        }
    };
}

const store = new Store();
// store.addSubscriber('1', (action, state) => {
//     console.log("---------------------");
//     switch (action) {
//         case initialState:
//             console.log("We are only getting started!!!!");
//             return;
//         default:
//             state.items.forEach(item => console.log(getItemPropertiesbyId(item.id) + " amount: " + item.amount));
//     }
// });
store.addSubscriber('2', (action, state) => {
    console.log("---------------------");
    switch (action) {
        case initialState:

        case addItem:

        case removeItem:

        case editItem:

        case clearShoppingCart:

    }

});

interface User{
    name:String;
        id:String;
}

const isOk = addITemInServer({
    id: '1',
    name: 'banana'
}).then((user:User)=>);


store.dispach(addItem, {
    item: {
        id: '1',
        name: 'banana'
    }
});
store.dispach(addItem, {
    item: {
        id: '1',
        name: 'banana'
    }
});