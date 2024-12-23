import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/get.last.months";

const { last12Month, last6Month } = getLastMonths();

const Barcharts = () => {
	
	const { user } = useSelector((state: RootState) => state.userReducer);

	const { isLoading, data, error, isError } = useBarQuery(
		user?._id as string
	);

	const products = data?.charts.product || [];
	const orders = data?.charts.orders || [];
	const users = data?.charts.users || [];

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
							<BarChart
								data_2={products}
								data_1={users}
								labels={last6Month}
								title_1='Products'
								title_2='Users'
								bgColor_1={`hsl(260, 50%, 30%)`}
								bgColor_2={`hsl(360, 90%, 90%)`}
							/>
							<h2>Top Products & Top Customers</h2>
						</section>

						<section>
							<BarChart
								horizontal={true}
								data_1={orders}
								data_2={[]}
								title_1='Orders'
								title_2=''
								bgColor_1={`hsl(180, 40%, 50%)`}
								bgColor_2=''
								labels={last12Month}
							/>
							<h2>Orders throughout the year</h2>
						</section>
					</>
				)}
			</main>
		</div>
	);
};

export default Barcharts;
