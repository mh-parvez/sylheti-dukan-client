import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
	useCategoriesQuery,
	useSearchProductsQuery,
} from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItemType } from "../types/types";
import ProductCard from "../components/ProductCard";
import { CartReduerInitialState, UserReduerInitialState } from "../types/reducer-types";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { HiMenuAlt1 } from "react-icons/hi";
import { FaHome } from "react-icons/fa";

const Search = () => {
	// ---------- Navbar Logic ----------
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const { cartItems } =
		useSelector(
			(state: { cartReducer: CartReduerInitialState }) =>
				state.cartReducer
		);

	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const [filterOpen, setFileterOpen] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const logoutHandler = async () => {
		try {
			await signOut(auth);
			toast.success("Sign Out Successfully");
			setMenuOpen(false);
		} catch (error) {
			toast.error("Sign Out Failed");
			console.error(error);
		}
	};
	// ---------- Navbar Logic ----------

	const [searchParams] = useSearchParams();
	const initialSearch = searchParams.get("query") || ""; // Extract query parameter
	const [search, setSearch] = useState(initialSearch);
	const [sort, setSort] = useState("");
	const [maxPrice, setMaxPrice] = useState(5000);
	const [category, setCatagory] = useState("");
	const [page, setPage] = useState(1);

	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Focus the search input when the component mounts
		searchInputRef.current?.focus();
	}, []);

	useEffect(() => {
		// Set filterOpen to true on window resize if width is <= 750px
		const handleResize = () => {
			if (window.innerWidth <= 750) {
				setFileterOpen(true);
			}
		};

		// Call the resize handler on mount and add event listener
		handleResize();
		window.addEventListener("resize", handleResize);

		// Cleanup the event listener on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		// Sync the search state if the URL query changes
		setSearch(initialSearch);
	}, [initialSearch]);

	const {
		data: categorisResponse,
		isLoading: loadingCategories,
		isError,
		error,
	} = useCategoriesQuery("");

	const {
		isLoading: productLoading,
		data: searchedData,
		isError: productIsError,
		error: productError,
	} = useSearchProductsQuery({
		search,
		sort,
		category,
		page,
		price: maxPrice,
	});

	const dispatch = useDispatch();

	const addToCartHandler = (cartItem: CartItemType) => {
		if (cartItem.stock < 1) return toast.error("Out of Stock");
		dispatch(addToCart(cartItem));
		toast.success("Added to cart");
	};

	const isNextPage = page > 1;
	const isPrevPage = page < (searchedData?.totalPage || 1);

	if (isError) {
		toast.error((error as CustomError).data.message);
	}

	if (productIsError) {
		toast.error((productError as CustomError).data.message);
	}

	// ---------- Navbar Logic ----------
	useEffect(() => {
		// Close the menu when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	// ---------- Navbar Logic ----------

	return (
		<div className='product-search-page'>
			{/* Fix this using HOC , Navbar repate 2 time */}
			<section className='navbar-section'>
				<nav className='navbar-container'>
					<ul>
						<li>
							<span
								className='bugur-btn'
								onClick={() => setFileterOpen(!filterOpen)}>
								<HiMenuAlt1 />
							</span>
						</li>

						<li>
							<Link to={"/"}>
								<span className='logo'>
									<FaHome />
								</span>
							</Link>
						</li>
						<li className='searchbar'>
							<input
								type='text'
								placeholder={`🔎 Search ...`}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								ref={searchInputRef} // Attach the ref to the search input
							/>
						</li>
						<li>
							<Link className='cart-icon' to='/cart'>
								<MdOutlineShoppingCart />
								{
									cartItems.length ? <span>{cartItems.length}</span> : ''
								}
							</Link>
						</li>

						{user?._id ? (
							<li>
								<button
									className='user-icon'
									onClick={() => setMenuOpen(!menuOpen)}>
									<FaRegCircleUser />
								</button>
							</li>
						) : (
							<li>
								<button className='login-button'>
									<Link to='/login'>Login</Link>
								</button>
							</li>
						)}
					</ul>
				</nav>

				{menuOpen && (
					<div className='user-menu' ref={menuRef}>
						<ul>
							<li>
								{user?.role === "admin" && (
									<Link
										to='/admin/dashboard'
										onClick={() => setMenuOpen(false)}>
										Admin Panel
									</Link>
								)}
							</li>
							<li>
								<Link
									to={"/orders"}
									onClick={() => setMenuOpen(false)}>
									Your Order
								</Link>
							</li>
							<li>
								<span onClick={logoutHandler}>Log out</span>
							</li>
						</ul>
					</div>
				)}
			</section>

			<div className='content-area-section'>
				{/* Filters Section */}
				<aside
					className={`filter-section ${filterOpen && "hideFilter"}`}>
					<div className='sort'>
						<label>Sort</label>
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}>
							<option value=''>Select</option>
							<option value='asc'>Low to High</option>
							<option value='dsc'>High to Low</option>
						</select>
					</div>
					<div className='maxPrice'>
						<label>MaxPrice</label>
						<input
							type='number'
							value={maxPrice}
							onChange={(e) =>
								setMaxPrice(Number(e.target.value))
							}
						/>
					</div>
					<div className='all-categoris'>
						<label>All Categories </label>
						<select
							value={category}
							onChange={(e) => setCatagory(e.target.value)}>
							<option value=''>All</option>
							{!loadingCategories &&
								categorisResponse?.categories.map((i) => (
									<option key={i} value={i}>
										{i}
									</option>
								))}
						</select>
					</div>
				</aside>

				<main className='all-product-section'>
					{productLoading ? (
						<h1>Loading ...</h1>
					) : (
						<div className='product-search-list'>
							{searchedData?.products.map((i) => (
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
							))}
						</div>
					)}
					{/* pagination */}
					{searchedData && searchedData.totalPage > 1 && (
						<article>
							<button
								disabled={!isNextPage}
								onClick={() => setPage((prev) => prev - 1)}>
								Prev
							</button>
							<span>
								{page} of {searchedData.totalPage}
							</span>
							<button
								disabled={!isPrevPage}
								onClick={() => setPage((prev) => prev + 1)}>
								Next
							</button>
						</article>
					)}
				</main>
			</div>
		</div>
	);
};

export default Search;
