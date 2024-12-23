import { Navigate, useParams } from "react-router-dom";
import { useProductsDetalisQuery } from "../redux/api/productAPI";
import { server } from "../redux/store";
import Navbar from './../components/Navbar';
import { CartReduerInitialState, UserReduerInitialState } from "../types/reducer-types";
import { useSelector } from "react-redux";

const ProductDetails = () => {

    const { user } = useSelector(
        (state: { userReducer: UserReduerInitialState }) => state.userReducer
    );

    const { cartItems } =
        useSelector(
            (state: { cartReducer: CartReduerInitialState }) =>
                state.cartReducer
        );

    const params = useParams();

    const { data, isError } = useProductsDetalisQuery(params.id!);


    const { price, photo, name, stock, category, weight, details, country } =
        data?.product || {
            name: "",
            photo: "",
            category: "",
            weight: "",
            details: "",
            country: "",
            stock: 0,
            price: 0,
        };

    if (isError) {
        return <Navigate to={"/404"} />;
    }

    return (
        <div>
            <Navbar user={user} cartItemCount={cartItems.length} />
            <main>
                <section className="product-detalis-page">
                    <div className="content-area">
                        <img src={`${server}/${photo}`} alt='Product' />
                        <div>
                            <strong>ID : {data?.product._id}</strong>
                            {stock > 0 ? (
                                <span className='green'>{stock} Available</span>
                            ) : (
                                <span className='red'> Not Available</span>
                            )}
                            <p>{name}</p>
                            <p>{category}</p>
                            <b>৳ {price}</b>
                            <p>{weight}</p>
                            <p>{country}</p>
                        </div>
                    </div>

                    <div>
                        <p className="details-p">{details}</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetails;
