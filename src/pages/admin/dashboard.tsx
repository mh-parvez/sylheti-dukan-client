import { BiMaleFemale } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";
import { useStatesQuery } from "../../redux/api/dashboardAPI";
import { RootState } from "../../redux/store";
import { getLastMonths } from "../../utils/get.last.months";

const Dashboard = () => {
	const { user } = useSelector((state: RootState) => state.userReducer);

	const { isLoading, data, isError } = useStatesQuery(user?._id as string);

	const stats = data?.stats;

	const orderArr: number[] = stats?.chart?.order || [];
	const revenueArr: number[] = stats?.chart?.revenue || [];

	const { last6Month: months } = getLastMonths();

	if (isError) return <Navigate to={"/"} />;

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="dashboard">
				{isLoading ? (
					<h1>Loading ...</h1>
				) : (
					<>
						<div className="bar">
							<FaRegBell />
							<img src={user?.photo} alt="User" />
						</div>

						<section className="widget-container">
							<WidgetItem
								percent={stats?.changeParcent.revenue || 0}
								amount={true}
								value={stats?.count.revenue || 0}
								heading="Revenue"
								color="rgb(0, 115, 255)"
							/>
							<WidgetItem
								percent={stats?.changeParcent.user || 0}
								value={stats?.count.user || 0}
								color="rgb(0 198 202)"
								heading="Users"
							/>
							<WidgetItem
								percent={stats?.changeParcent.order || 0}
								value={stats?.count.order || 0}
								color="rgb(255 196 0)"
								heading="Transactions"
							/>
							<WidgetItem
								percent={stats?.changeParcent.product || 0}
								value={stats?.count.product || 0}
								color="rgb(76 0 255)"
								heading="Products"
							/>
						</section>

						<section className="graph-container">
							<div className="revenue-chart">
								<h2>Revenue & Transaction</h2>
								<BarChart
									labels={months}
									data_1={orderArr}
									data_2={revenueArr}
									title_1="Revenue"
									title_2="Transaction"
									bgColor_1="rgb(0, 115, 255)"
									bgColor_2="rgba(53, 162, 235, 0.8)"
								/>
							</div>

							<div className="dashboard-categories">
								<h2>Inventory</h2>
								<div>
									{stats?.categoryCount?.map((i) => {
										const [heading, value] = Object.entries(i)[0];

										return (
											<CategoryItem
												key={heading}
												value={value as number}
												heading={heading}
												color={`hsl(${value * 4}, ${value}%, 50%)`}
											/>
										);
									})}
								</div>
							</div>
						</section>

						<section className="transaction-container">
							<div className="gender-chart">
								<h2>Gender Ratio</h2>
								<DoughnutChart
									labels={["Female", "Male"]}
									data={[
										stats?.userRatio?.female || 0,
										stats?.userRatio?.male || 0,
									]}
									backgroundColor={[
										"hsl(340, 82%, 56%)",
										"rgba(53, 162, 235, 0.8)",
									]}
									cutout={90}
								/>
								<p>
									<BiMaleFemale />
								</p>
							</div>
							<Table data={stats?.latestTransections || []} />
						</section>
					</>
				)}
			</main>
		</div>
	);
};

interface WidgetItemProps {
	heading: string;
	value: number;
	percent: number;
	color: string;
	amount?: boolean;
}

const WidgetItem = ({
	heading,
	value,
	percent,
	color,
	amount = false,
}: WidgetItemProps) => {
	console.log(percent);

	return (
		<article className='widget'>
			<div className='widget-info'>
				<p>{heading}</p>
				<h4>{amount ? `৳${value}` : value}</h4>
				{percent > 0 ? (
					<span className='green'>
						<HiTrendingUp /> +
						{`${percent > 10000 ? 9999 : percent}%`}
					</span>
				) : (
					<span className='red'>
						<HiTrendingDown />{" "}
						{`${percent > 10000 ? 9999 : percent}%`}
					</span>
				)}
			</div>

			<div
				className='widget-circle'
				style={{
					background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
				}}>
				<span
					style={{
						color,
					}}>
					{percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
					{percent < 0 && `${percent > -10000 ? -9999 : percent}%`}
				</span>
			</div>
		</article>
	);
};

interface CategoryItemProps {
	color: string;
	value: number;
	heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
	<div className='category-item'>
		<h5>{heading}</h5>
		<div>
			<div
				style={{
					backgroundColor: color,
					width: `${value}%`,
				}}></div>
		</div>
		<span>{value}%</span>
	</div>
);

export default Dashboard;
