import React, { Fragment, useEffect } from 'react';

import MetaData from './layuot/MetaData';
import Product from './product/Product';
import Loader from './layuot/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { getProducts } from '../actions/ProductActions';


const Home = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, products, error, productsCount } = useSelector(state => state.products)

    useEffect(() => {
        if (error){
            return alert.error(error)
        }

        dispatch(getProducts());

    }, [dispatch, alert, error])

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Buy Best Products Online'} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" class="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home;