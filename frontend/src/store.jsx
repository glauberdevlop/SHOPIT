import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { productReducers, productDetailsReducer } from './reducers/productReducer';
import { authReducers } from './reducers/userReducers';

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducer,
    auth: authReducers
})


let initialState = {}

const middlware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;