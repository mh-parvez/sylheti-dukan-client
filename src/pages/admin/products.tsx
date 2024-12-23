import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { server } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { UserReduerInitialState } from "../../types/reducer-types";

interface DataType {
	photo: ReactElement;
	name: string;
	price: number;
	stock: number;
	action: ReactElement;
}

const columns: Column<DataType>[] = [
	{
		Header: "Photo",
		accessor: "photo",
	},
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Price",
		accessor: "price",
	},
	{
		Header: "Stock",
		accessor: "stock",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];


const Products = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const { data, isLoading, error, isError } = useAllProductsQuery(
		user?._id as string
	);

	const [rows, setRows] = useState<DataType[]>([]);

	if (isError) {
		toast.error((error as CustomError).data.message);
	}

	useEffect(() => {
		if (data) {
			setRows(
				data.products.map((i) => ({
					photo: <img src={`${server}/${i.photo}`} />,
					name: i.name,
					price: i.price,
					stock: i.stock,
					action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
				}))
			);
		}
	}, [data]);

	const Table = TableHOC<DataType>(
		columns,
		rows,
		"dashboard-product-box",
		"Product Management",
		rows.length > 6
	)();

	return (
		<div className='admin-container'>
			<AdminSidebar />
			<main>{isLoading ? <h1>Loading ...</h1> : Table}</main>
			<Link to='/admin/product/new' className='create-product-btn'>
				<FaPlus />
			</Link>
		</div>
	);
};

export default Products;
