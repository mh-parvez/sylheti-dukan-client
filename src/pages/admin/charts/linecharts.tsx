import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/get.last.months";

const { last12Month: months } = getLastMonths();

const Linecharts = () => {
	const { user } = useSelector((state: RootState) => state.userReducer);

	const { isLoading, data, error, isError } = useLineQuery(
		user?._id as string
	);

	// Ensure data is always an array
	const products: number[] = Array.isArray(data?.charts.product) ? data.charts.product : [];
	const users: number[] = Array.isArray(data?.charts.users) ? data.charts.users : [];
	const revenue: number[] = Array.isArray(data?.charts.revenue) ? data.charts.revenue : [];
	const discount: number[] = Array.isArray(data?.charts.discount) ? data.charts.discount : [];

	if (isError) {
		toast.error((error as CustomError).data.message);
	}

	return (
		<div className='admin-container'>
			<AdminSidebar />
			<main className='chart-container'>
				{isLoading ? (
					<h1>Loading ...</h1>
				) : (
					<>
						<section>
							<LineChart
								data={users}
								label='Users'
								borderColor='rgb(53, 162, 255)'
								labels={months}
								backgroundColor='rgba(53, 162, 255, 0.5)'
							/>
							<h2>Active Users</h2>
						</section>

						<section>
							<LineChart
								data={products}
								backgroundColor={"hsla(269,80%,40%,0.4)"}
								borderColor={"hsl(269,80%,40%)"}
								labels={months}
								label='Products'
							/>
							<h2>Total Products (SKU)</h2>
						</section>

						<section>
							<LineChart
								data={revenue}
								backgroundColor={"hsla(129,80%,40%,0.4)"}
								borderColor={"hsl(129,80%,40%)"}
								label='Revenue'
								labels={months}
							/>
							<h2>Total Revenue </h2>
						</section>

						<section>
							<LineChart
								data={discount}
								backgroundColor={"hsla(29,80%,40%,0.4)"}
								borderColor={"hsl(29,80%,40%)"}
								label='Discount'
								labels={months}
							/>
							<h2>Discount Allotted </h2>
						</section>
					</>
				)}
			</main>
		</div>
	);
};

export default Linecharts;
