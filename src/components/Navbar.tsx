import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { User } from "../types/types";
import { auth } from "../firebase";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShopify } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

interface PropsType {
	user: User | null;
	cartItemCount?: number;
}

const Navbar = ({ user, cartItemCount }: PropsType) => {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
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

	// Close the menu when clicking outside
	useEffect(() => {
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

	return (
		<section className='navbar-section'>
			<nav className='navbar-container'>
				<ul>
					<li>
						<Link to={"/"}>
							<span className='logo'>
								<FaShopify />
								Sylheti Dukan
							</span>
						</Link>
					</li>

					<li className='login-btn'>
						<Link className='cart-icon' to='/search'>
							<LuSearch />
						</Link>
					</li>
					<li>
						<Link className='cart-icon' to='/cart'>
							<MdOutlineShoppingCart />
							{
								cartItemCount ? <span>{cartItemCount}</span> : ''
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
	);
};

export default Navbar;
