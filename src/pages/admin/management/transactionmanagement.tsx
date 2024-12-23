import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
	useDeleteOrderMutation,
	useOrderDetailsQuery,
	useUpdateOrderMutation,
} from "../../../redux/api/orderAPI";
import { server } from "../../../redux/store";
import { UserReduerInitialState } from "../../../types/reducer-types";
import { Order, OrdertItem } from "../../../types/types";
import { responseToast } from "../../../utils/response.toast";

const defaultData: Order = {
	shippingInfo: {
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
	},
	status: "",
	subtotal: 0,
	discount: 0,
	shippingCharges: 0,
	tax: 0,
	total: 0,
	orderItems: [],
	_id: "",
	user: {
		_id: "",
		name: "",
	},
};

const TransactionManagement = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const params = useParams();
	const navigate = useNavigate();

	const { isLoading, data, isError } = useOrderDetailsQuery(
		params.id as string
	);

	const [updateOrder] = useUpdateOrderMutation();
	const [deleteOrder] = useDeleteOrderMutation();

	const updateHandler = async () => {
		const res = await updateOrder({
			userId: user?._id as string,
			orderId: data?.order._id as string,
		});
		responseToast(res, navigate, "/admin/transaction");
	};

	const deleteHandler = async () => {
		const res = await deleteOrder({
			userId: user?._id as string,
			orderId: data?.order._id as string,
		});
		responseToast(res, navigate, "/admin/transaction");
	};

	const {
		shippingInfo: { address, city, state, country, pinCode },
		orderItems,
		user: username,
		status,
		tax,
		subtotal,
		discount,
		shippingCharges,
		total,
	} = data?.order || defaultData;

	if (isError) {
		return <Navigate to={"/404"} />;
	}

	return (
		<div className='admin-container'>
			<AdminSidebar />
			<main className='transection-management-page'>
				{isLoading ? (
					<h1>Loading ...</h1>
				) : (
					<>
						<h2>Order Items</h2>
						<section>
							{orderItems.map((i) => (
								<ProductCard
									key={i._id}
									name={i.name}
									photo={`${server}/${i.photo}`}
									productId={i.productId}
									_id={i._id}
									quantity={i.quantity}
									price={i.price}
								/>
							))}
						</section>

						<article className='shipping-info-card'>
							<h1>Order Info</h1>
							<h5>User Info</h5>
							<p>Name: {user?.name}</p>
							<p>
								Address:{" "}
								{`${address}, ${city}, ${state}, ${country} ${pinCode}`}
							</p>
							<h5>Amount Info</h5>
							<p>Subtotal: {subtotal}</p>
							<p>Shipping Charges: {shippingCharges}</p>
							<p>Tax: {tax}</p>
							<p>Discount: {discount}</p>
							<p>Total: {total}</p>

							<h5>Status Info</h5>
							<p>
								Status:{" "}
								<span
									className={
										status === "Delivered"
											? "purple"
											: status === "Shipped"
												? "green"
												: "red"
									}>
									{status}
								</span>
							</p>
							<div className="btn-container">
								<div>
									<button
										className='product-delete-btn'
										onClick={deleteHandler}>
										Cancel Order
									</button>
								</div>
								<div>
									<button
										className='shipping-btn'
										onClick={updateHandler}>
										Process Status
									</button>
								</div>
							</div>
						</article>
					</>
				)}
			</main>
		</div>
	);
};

const ProductCard = ({
	name,
	photo,
	price,
	quantity,
	productId,
}: OrdertItem) => (
	<div className='transaction-product-card'>
		<img src={photo} alt={name} />
		<Link to={`/product/${productId}`}>{name}</Link>
		<span>
			৳{price} X {quantity} = ৳{price * quantity}
		</span>
	</div>
);

export default TransactionManagement;
