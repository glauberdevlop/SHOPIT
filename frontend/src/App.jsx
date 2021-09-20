import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from "./components/layuot/Header";
import Footer from "./components/layuot/Footer";

import Home from "./components/Home";
import ProductDetails from './components/product/ProductDetails';

import Login from './components/user/Login';
import Register from './components/user/Register';

import { loadUser } from './actions/userActions';
import store from './store'

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} exact />
          <Route path="/product/:id" component={ProductDetails} />

          <Route path="/login" component={Login} /> 
          <Route path="/register" component={Register} />
          
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
