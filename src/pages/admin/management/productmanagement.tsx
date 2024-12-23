import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReduerInitialState } from "../../../types/reducer-types";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
	useDeleteProductMutation,
	useProductsDetalisQuery,
	useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { server } from "../../../redux/store";
import { responseToast } from "../../../utils/response.toast";

const Productmanagement = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const params = useParams();
	const navigate = useNavigate();

	const { data, isError } = useProductsDetalisQuery(params.id!);

	const { price, photo, name, stock, category, weight, details, country } =
		data?.product || {
			name: "",
			photo: "",
			category: "",
			weight: "",
			details: "",
			country: "",
			stock: 0,
			price: 0,
		};

	const [priceUpdate, setPriceUpdate] = useState<number>(price);
	const [stockUpdate, setStockUpdate] = useState<number>(stock);
	const [nameUpdate, setNameUpdate] = useState<string>(name);
	const [weightUpdate, setWeightUpdate] = useState<string>(weight);
	const [countryUpdate, setCountryUpdate] = useState<string>(country);
	const [detailsUpdate, setDetailsUpdate] = useState<string>(details);
	const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
	const [photoUpdate, setPhotoUpdate] = useState<string>("");
	const [photoFile, setPhotoFile] = useState<File>();

	const [updateProduct] = useUpdateProductMutation();
	const [deleteProduct] = useDeleteProductMutation();

	const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];

		const reader: FileReader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				if (typeof reader.result === "string") {
					setPhotoUpdate(reader.result);
					setPhotoFile(file);
				}
			};
		}
	};

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();

		if (nameUpdate) formData.set("name", nameUpdate);
		if (weightUpdate) formData.set("weight", weightUpdate);
		if (countryUpdate) formData.set("country", countryUpdate);
		if (detailsUpdate) formData.set("details", detailsUpdate);
		if (priceUpdate) formData.set("price", priceUpdate.toString());
		if (stockUpdate !== undefined)
			formData.set("stock", stockUpdate.toString());
		if (photoFile) formData.set("photo", photoFile);
		if (categoryUpdate) formData.set("category", categoryUpdate);

		const res = await updateProduct({
			formData,
			userId: user?._id as string,
			productId: data?.product._id as string,
		});

		responseToast(res, navigate, "/admin/product");
	};

	const deleteHandler = async () => {
		const res = await deleteProduct({
			userId: user?._id as string,
			productId: data?.product._id as string,
		});

		responseToast(res, navigate, "/admin/product");
	};

	useEffect(() => {
		if (data) {
			setNameUpdate(data.product.name);
			setWeightUpdate(data.product.weight);
			setDetailsUpdate(data.product.details);
			setCountryUpdate(data.product.country);
			setPriceUpdate(data.product.price);
			setStockUpdate(data.product.stock);
			setCategoryUpdate(data.product.category);
		}
	}, [data]);

	if (isError) {
		return <Navigate to={"/404"} />;
	}

	return (
		<div className='admin-container'>
			<AdminSidebar />
			<main className='product-management'>
				<section>

					<div className="content-area">
						<img src={`${server}/${photo}`} alt='Product' />
						<div>
							<strong>ID : {data?.product._id}</strong>
							{stock > 0 ? (
								<span className='green'>{stock} Available</span>
							) : (
								<span className='red'> Not Available</span>
							)}
							<p>{name}</p>
							<p>{category}</p>
							<b>৳ {price}</b>
							<p>{weight}</p>
							<p>{country}</p>
						</div>
					</div>

					<div>
						<p className="details-p">{details}</p>
					</div>

				</section>

				<article>
					<h2> Update Product</h2>
					<form onSubmit={submitHandler}>
						<div>
							<label>Name</label>
							<input
								type='text'
								placeholder='Name'
								value={nameUpdate}
								onChange={(e) => setNameUpdate(e.target.value)}
							/>
						</div>
						<div>
							<label>Price</label>
							<input
								type='number'
								placeholder='Price'
								value={priceUpdate}
								onChange={(e) =>
									setPriceUpdate(Number(e.target.value))
								}
							/>
						</div>

						<div>
							<label>Weight</label>
							<input
								required
								type='text'
								placeholder='Weight'
								value={weightUpdate}
								onChange={(e) =>
									setWeightUpdate(e.target.value)
								}
							/>
						</div>

						<div>
							<label>Stock</label>
							<input
								type='number'
								placeholder='Stock'
								value={stockUpdate}
								onChange={(e) =>
									setStockUpdate(Number(e.target.value))
								}
							/>
						</div>

						<div>
							<label>Category</label>
							<input
								type='text'
								placeholder='eg. laptop, camera etc'
								value={categoryUpdate}
								onChange={(e) =>
									setCategoryUpdate(e.target.value)
								}
							/>
						</div>

						<div>
							<label>Country</label>
							<input
								required
								type='text'
								placeholder='Bangladesh, USA, India etc'
								value={countryUpdate}
								onChange={(e) =>
									setCountryUpdate(e.target.value)
								}
							/>
						</div>

						<div>
							<label>Details</label>
							<textarea
								required
								placeholder='Product description ...'
								value={detailsUpdate}
								onChange={(e) =>
									setDetailsUpdate(e.target.value)
								}></textarea>
						</div>

						<div>
							<label>Photo</label>
							{photoUpdate && (
								<img src={photoUpdate} alt='New Image' />
							)}
							<input type='file' onChange={changeImageHandler} />
						</div>

						<div>
							<button className="delete-btn" onClick={deleteHandler}>
								Delete Product
							</button>
						</div>

						<div>
							<button type='submit'>Update Product</button>
						</div>
					</form>
				</article>
			</main>
		</div>
	);
};

export default Productmanagement;
