import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { productReducers, productDetailsReducer } from './reducers/productReducer';
import { authReducers, userReducer, forgotPasswordReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducer'

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducer,
    auth: authReducers,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer
})


let initialState = {
    cart:{
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : []
    }
}

const middlware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;