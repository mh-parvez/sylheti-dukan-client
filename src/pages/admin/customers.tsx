import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import {
	useAllUserQuery,
	useDeleteUserMutation,
} from "../../redux/api/userAPI";
import { CustomError } from "../../types/api-types";
import { UserReduerInitialState } from "../../types/reducer-types";
import { responseToast } from "../../utils/response.toast";

interface DataType {
	avatar: ReactElement;
	name: string;
	email: string;
	gender: string;
	role: string;
	action: ReactElement;
}

const columns: Column<DataType>[] = [
	{
		Header: "Avatar",
		accessor: "avatar",
	},
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Gender",
		accessor: "gender",
	},
	{
		Header: "Email",
		accessor: "email",
	},
	{
		Header: "Role",
		accessor: "role",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];

const Customers = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const { isLoading, data, isError, error } = useAllUserQuery(
		user?._id as string
	);

	const [rows, setRows] = useState<DataType[]>([]);

	if (isError) {
		toast.error((error as CustomError).data.message);
	}

	const [deleteUser] = useDeleteUserMutation();

	const deleleHandler = async (userId: string) => {
		const res = await deleteUser({
			userId,
			adminUserId: user?._id as string,
		});
		responseToast(res, null, "");
	};

	useEffect(() => {
		console.log(data?.users);
		if (data) {
			setRows(
				data.users.map((i) => ({
					avatar: <img src={i.photo} style={{borderRadius: "50%"}}/>,
					name: i.name,
					email: i.email,
					gender: i.gender,
					role: i.role,
					action: (
						<button onClick={() => deleleHandler(i._id)}>
							<FaTrash />
						</button>
					),
				}))
			);
		}
	}, [data]);

	const Table = TableHOC<DataType>(
		columns,
		rows,
		"dashboard-product-box",
		"Customers",
		rows.length > 6
	)();

	return (
		<div className='admin-container'>
			<AdminSidebar />
			<main>{isLoading ? <h1>Loading ...</h1> : Table}</main>
		</div>
	);
};

export default Customers;
