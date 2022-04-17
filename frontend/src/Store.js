import { createContext, useReducer } from "react";

// Creat store [control global asupra -> State]
export const Store = createContext();

// Default 
const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') 
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [] 
    }
}

// Default state
const reducer = (state, action) => {
    switch(action.type) {
        case 'CART_ADD_ITEM': {
            const newProduct = action.payload;
            const existProduct = state.cart.cartItems.find((x) => x._id === newProduct._id);
            const cartItems = existProduct ? state.cart.cartItems.map((item) => {
                return item._id === newProduct._id ? newProduct : item;
            }) : 
            [...state.cart.cartItems, newProduct];

            // Salvam in localStorage
            localStorage.setItem('cartItems',JSON.stringify(cartItems));
        
            return {...state, cart:{...state.cart, cartItems}};
        }

        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );

            // Refresh in localStorage
            localStorage.setItem('cartItems',JSON.stringify(cartItems));
            return {...state, cart: {...state.cart, cartItems}};
        }

        default:
            return state;
    }
}

// Callback pentru a putea folosi [createContext]
export default function StoreProvider(props){

    const [state, dispatch] = useReducer(reducer,initialState)

    // Dispatch -> modifica state
    const value = {state, dispatch};

    // Transmitem ...valorile [pattern]
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}