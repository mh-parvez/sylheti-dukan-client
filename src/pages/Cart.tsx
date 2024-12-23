import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/CartItem";
import Navbar from "../components/Navbar";
import {
	addToCart,
	calculatePrice,
	discountApplied,
	removeCartItem,
} from "../redux/reducer/cartReducer";
import { server } from "../redux/store";
import {
	CartReduerInitialState,
	UserReduerInitialState,
} from "../types/reducer-types";
import { CartItemType } from "../types/types";

const Cart = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const { cartItems, subtotal, tax, total, discount, shippingCharges } =
		useSelector(
			(state: { cartReducer: CartReduerInitialState }) =>
				state.cartReducer
		);

	console.log(cartItems);

	const dispatch = useDispatch();

	const [couponCode, setCouponCode] = useState<string>("");
	const [isValidCouponCode, setIsVaildCouponCode] = useState<boolean>(false);

	const incrementHandler = (cartItem: CartItemType) => {
		if (cartItem.quantity >= cartItem.stock) return;

		dispatch(
			addToCart({
				...cartItem,
				quantity: cartItem.quantity + 1,
			})
		);
	};

	const decrementHandler = (cartItem: CartItemType) => {
		if (cartItem.quantity <= 1) return;

		dispatch(
			addToCart({
				...cartItem,
				quantity: cartItem.quantity - 1,
			})
		);
	};

	const removeHandler = (productId: string) => {
		dispatch(removeCartItem(productId));
	};

	useEffect(() => {
		const { token, cancel } = axios.CancelToken.source();

		const timeOutId = setTimeout(() => {
			axios
				.get(
					`${server}/api/v1/payment/discount/apply?coupon=${couponCode}`,
					{
						cancelToken: token,
					}
				)
				.then((res) => {
					// console.log(res.data);
					dispatch(discountApplied(res.data.discount));
					setIsVaildCouponCode(true);
					dispatch(calculatePrice());
				})
				.catch((e) => {
					console.log(e.response.data.message);
					dispatch(discountApplied(0));
					setIsVaildCouponCode(false);
					dispatch(calculatePrice());
				});
		}, 1000);

		return () => {
			clearTimeout(timeOutId);
			cancel();
			setIsVaildCouponCode(false);
		};
	}, [couponCode]);

	useEffect(() => {
		dispatch(calculatePrice());
	}, [cartItems]);

	return (
		<div>
			<Navbar user={user} cartItemCount={cartItems.length} />
			<div className='cart'>
				<main>
					{cartItems.length > 0 ? (
						cartItems.map((item) => (
							<CartItemCard
								incrementHandler={incrementHandler}
								decrementHandler={decrementHandler}
								removeHandler={removeHandler}
								key={item.productId}
								cartItem={item}
							/>
						))
					) : (
						<p className='no-item'>No Items!</p>
					)}
				</main>

				<aside>
					<h1>Order Information</h1>
					<p>Subtotal : ৳ {subtotal} </p>
					<p>Shipping Charges : ৳ {shippingCharges}</p>
					<p>Tax : ৳ {tax}</p>
					<p>
						Discount :<em className='red'> -৳ {discount} </em>
					</p>
					<p>
						<b>Total : ৳ {total}</b>
					</p>

					{couponCode &&
						(isValidCouponCode ? (
							<span className='green'>
								৳ {discount} of using the{" "}
								<code>{couponCode}</code>
							</span>
						) : (
							<span className='red'>
								Invalid Coupon <VscError />
							</span>
						))}

					<input
						type='text'
						placeholder='Coupon Code'
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
					/>

					{cartItems.length > 0 && (
						<Link to={"/shipping"}>Checkout</Link>
					)}
				</aside>
			</div>
		</div>
	);
};

export default Cart;
