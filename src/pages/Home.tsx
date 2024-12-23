import { useState } from "react";
import { toast } from "react-hot-toast";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { TbMoneybag } from "react-icons/tb";
import { TfiWallet } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Slider from "../components/Slider";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartReduerInitialState, UserReduerInitialState } from "../types/reducer-types";
import { CartItemType } from "../types/types";
import Navbar from "./../components/Navbar";

const Home = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const { cartItems } =
		useSelector(
			(state: { cartReducer: CartReduerInitialState }) =>
				state.cartReducer
		);

	const { data, isLoading, isError } = useLatestProductsQuery("");
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		navigate(`/search?query=${encodeURIComponent(value)}`); // Pass query as URL parameter
	};

	const addToCartHandler = (cartItem: CartItemType) => {
		if (cartItem.stock < 1) return toast.error("Out of Stock");
		dispatch(addToCart(cartItem));
		toast.success("Added to cart");
	};

	if (isError) toast.error("Can Not Fetch Product");

	return (
		<div>
			<Navbar user={user} cartItemCount={cartItems.length}/>
			<main className='home-page-container'>

				{/* CONTAINER - 1 */}
				<section className='header-contianer'>
					<div className='text-contianer'>
						<h1>Grocery Delivered at your Doorstep!</h1>
						<input
							type='search'
							placeholder={`🔎 Search for products (e.g. eggs, milk, potato)`}
							value={search}
							onChange={handleSearchChange} // Navigate and update query
						/>
					</div>
					<div className='slider-contianer'>
						<Slider />
					</div>
				</section>

				{/* CONTAINER - 2 */}
				<section className='stats-container'>
					<div className='stats-card'>
						<div className='icon'>
							<GiShoppingCart />{" "}
						</div>
						<div className='text'>
							<span>+15000 products</span> to shop from
						</div>
					</div>
					<div className='stats-card'>
						<div className='icon'>
							{" "}
							<TfiWallet />{" "}
						</div>
						<div className='text'>
							Pay <span>after</span> receiving products
						</div>
					</div>
					<div className='stats-card'>
						<div className='icon'>
							{" "}
							<CiDeliveryTruck />{" "}
						</div>
						<div className='text'>
							Get your delivery within <span>1 hour</span>
						</div>
					</div>
					<div className='stats-card'>
						<div className='icon'>
							{" "}
							<TbMoneybag />{" "}
						</div>
						<div className='text'>
							Get offers that <span> Save Money</span>
						</div>
					</div>
				</section>

				{/* CONTAINER - 3 */}
				<section className='populer-products-seciton'>
					<div className='headingAndlink'>
						<span className='headline'>Popular Products</span>
						<span className='link'>
							{" "}
							<Link to={"search"}>View More </Link>
						</span>
					</div>
					<div className='popular-products-area'>
						{isLoading ? (
							<h1>Loading ...</h1>
						) : (
							data?.products.map((i) => (

								<ProductCard
									key={i._id}
									productId={i?._id}
									name={i.name}
									price={i.price}
									stock={i.stock}
									weight={i.weight}
									handler={addToCartHandler}
									photo={i.photo}
								/>
							))
						)}
					</div>
				</section>
			</main>
		</div>
	);
};

export default Home;
