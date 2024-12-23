import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReduerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { responseToast } from "../../../utils/response.toast";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReduerInitialState }) => state.userReducer
	);

	const [name, setName] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [stock, setStock] = useState<number>(1);
	const [weight, setWight] = useState<string>("");
	const [country, setCountry] = useState<string>("");
	const [details, setDetails] = useState<string>("");
	const [photoPrev, setPhotoPrev] = useState<string>("");
	const [photo, setPhoto] = useState<File>();

	const [newProduct] = useNewProductMutation();
	const navigate = useNavigate();

	const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];

		const reader: FileReader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				if (typeof reader.result === "string") {
					setPhotoPrev(reader.result);
					setPhoto(file);
				}
			};
		}
	};

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			!name ||
			!price ||
			stock < 0 ||
			!category ||
			!photo ||
			!weight ||
			!country ||
			!details
		)
			return;

		const formData = new FormData();
		formData.set("name", name);
		formData.set("price", price.toString());
		formData.set("stock", stock.toString());
		formData.set("category", category);
		formData.set("weight", weight);
		formData.set("country", country);
		formData.set("details", details);
		formData.set("photo", photo);

		const res = await newProduct({ id: user?._id as string, formData });
		responseToast(res, navigate, "/admin/product");
	};

	return (
		<div className='admin-container'>
			<AdminSidebar />
			<main className='new-product-container'>
				<article>
					<h2>Create Product</h2>

					<form onSubmit={submitHandler}>

						<div>
							<label>Name</label>
							<input
								required
								type='text'
								placeholder='banana, rice, mango'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div>
							<label>Price</label>
							<input
								required
								type='number'
								value={price}
								onChange={(e) => setPrice(Number(e.target.value))}
							/>
						</div>

						<div>
							<label>Weight</label>
							<input
								required
								type='text'
								placeholder='450gm, 2kg, 100ml'
								value={weight}
								onChange={(e) => setWight(e.target.value)}
							/>
						</div>

						<div>
							<label>Stock</label>
							<input
								required
								type='number'
								value={stock}
								onChange={(e) => setStock(Number(e.target.value))}
							/>
						</div>

						<div>
							<label>Category</label>
							<input
								required
								type='text'
								placeholder='vegetable, rice, fruit'
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</div>

						<div>
							<label>Country</label>
							<input
								required
								type='text'
								placeholder='bangladesh, usa, india'
								value={country}
								onChange={(e) => setCountry(e.target.value)}
							/>
						</div>

						<div>
							<label>Details</label>
							<textarea
								required
								placeholder='Wirte about product details ...'
								value={details}
								onChange={(e) =>
									setDetails(e.target.value)
								}></textarea>
						</div>

						<div>
							<label>Photo</label>
							{photoPrev && <img src={photoPrev} alt='New Image' />}
							<input type='file' onChange={changeImageHandler} />
						</div>
						
						<div>
							<button type='submit'>Create Product</button>
						</div>

					</form>
				</article>
			</main>
		</div>
	);
};

export default NewProduct;
