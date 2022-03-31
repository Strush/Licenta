import { createContext, useReducer } from "react";

// Creat store [control global asupra -> State]
export const Store = createContext();

// Default 
const initialState = {
    cart: {
        cartItems: []
    }
}

// Default state
const reducer = (state, action) => {
    switch(action.type) {
        case 'CART_ADD_ITEM':
            return {...state, 
                cart: {...state.cart,
                cartItems: [...state.cart.cartItems,action.payload]
            },
        };
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