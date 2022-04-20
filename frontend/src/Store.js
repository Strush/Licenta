import { createContext, useReducer } from "react";

// Creat store [control global asupra -> State]
export const Store = createContext();

// Default 
const initialState = {

    userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

    cart: {
        shippingAddress: localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {},

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

            // Setat {} in localStorage
            localStorage.setItem('cartItems',JSON.stringify(cartItems));
            return {...state, cart: {...state.cart, cartItems}};
        }

        case 'USER_SIGNIN': {
            return {...state, userInfo: action.payload}
        }

        case 'USER_SIGN_OUT': {
            return {...state, userInfo: null, 
                cart: {cartItems: [], shippingAddress: {}}
            };
        }

        case 'SAVE_SHIPPING_ADDRESS': {
            return {...state, cart: {
                ...state.cart,
                shippingAddress: action.payload
                }
            } 
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