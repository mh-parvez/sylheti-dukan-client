import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { CustomError } from "../types/api-types";
import { UserReduerInitialState } from "../types/reducer-types";

type DataType = {
	_id: string;
	amount: number;
	quantity: number;
	discount: number;
	status: ReactElement;
};

const column: Column<DataType>[] = [
	{
		Header: "ID",
		accessor: "_id",
	},
	{
		Header: "Quantity",
		accessor: "quantity",
	},
	{
		Header: "Discount",
		accessor: "discount",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
	{
		Header: "Status",
		accessor: "status",
	}
];

const Orders = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const { isLoading, data, isError, error } = useMyOrdersQuery(
		user?._id as string
	);

	const [rows, setRows] = useState<DataType[]>([]);

	if (isError) {
		toast.error((error as CustomError).data.message);
	}

	useEffect(() => {
		if (data) {
			setRows(
				data.orders.map((i) => ({
					_id: i._id,
					amount: i.total,
					discount: i.discount,
					quantity: i.orderItems.length,
					status: (
						<span
							className={
								i.status === "Processing"
									? "red"
									: i.status === "Shipped"
									? "green"
									: "purple"
							}>
							{i.status}
						</span>
					)
				}))
			);
		}
	}, [data]);

	const Table = TableHOC<DataType>(
		column,
		rows,
		"dashboard-product-box",
		"Orders Details",
		rows.length > 6
	)();

	return (
		<div className='container'>
			<main>{isLoading ? <h1>Loading ...</h1> : Table}</main>
		</div>
	);
};

export default Orders;
