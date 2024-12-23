import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItemType } from "../types/types";

type CartItemProps = {
	cartItem: CartItemType;
	incrementHandler: (cartItem: CartItemType) => void;
	decrementHandler: (cartItem: CartItemType) => void;
	removeHandler: (id: string) => void;
};

const CartItem = ({
	cartItem,
	incrementHandler,
	decrementHandler,
	removeHandler,
}: CartItemProps) => {
	const { productId, photo, name, price, quantity } = cartItem;

	return (
		<div className='cart-items'>
			<img src={`${server}/${photo}`} alt={name} />
			<article>
				<Link to={`/product/${productId}`}>{name}</Link>
				<span> ৳{price}</span>
			</article>

			<div>
				<button onClick={() => incrementHandler(cartItem)}> + </button>
				<p>{quantity}</p>
				<button onClick={() => decrementHandler(cartItem)}> - </button>
			</div>

			<button className="delete">
				{" "}
				<FaTrash onClick={() => removeHandler(productId)} />{" "}
			</button>
		</div>
	);
};

export default CartItem;
