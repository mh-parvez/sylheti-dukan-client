import { MdOutlineShoppingCart } from "react-icons/md";
import { server } from "../redux/store";
import { CartItemType } from "../types/types";
import { Link } from "react-router-dom";

type ProductCardProps = {
	productId: string;
	photo: string;
	name: string;
	price: number;
	weight: string;
	stock: number;
	handler: (cartItem: CartItemType) => string | undefined;
};

const ProductCard = ({
	productId,
	photo,
	name,
	price,
	stock,
	weight,
	handler,
}: ProductCardProps) => {
	return (
		<div className='product-card-container'>
			<div className='product-info'>
				<Link to={`/product/${productId}`}>i</Link>
				<img src={`${server}/${photo}`} alt={name} />
				<p>{name}</p>
			</div>
			<div className='add-to-card-button'>
				<p>{weight}</p>
				<span className='price'>৳ {price}</span>
				<button
					onClick={() =>
						handler({
							productId,
							price,
							name,
							weight,
							photo,
							stock,
							quantity: 1,
						})
					}>
					<MdOutlineShoppingCart /> Add to bag
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
