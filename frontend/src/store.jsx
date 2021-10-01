import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { productReducers, productDetailsReducer } from './reducers/productReducer';
import { authReducers, userReducer, forgotPasswordReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducer';
import { newOrderReducer } from './reducers/orderReducer'

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducer,
    auth: authReducers,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer
})


let initialState = {
    cart:{
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {}
    }
}

const middlware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;