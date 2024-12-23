import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

const Login = () => {
	const [gender, setGender] = useState("");
	const [date, setDate] = useState("");

	const [login] = useLoginMutation();

	const loginInHandler = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const { user } = await signInWithPopup(auth, provider);

			const res = await login({
				name: user.displayName!,
				email: user.email!,
				photo: user.photoURL!,
				gender,
				role: "user",
				dob: date,
				_id: user.uid,
			});

			if ("data" in res) {
				toast.success(res.data?.message as string);
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = (error.data as MessageResponse).message;
				toast.error(message);
			}
		} catch (e) {
			console.log(e);
			toast.error("Sign In Fail");
		}
	};

	return (
		<div className='login-contianer'>
			<div className='login'>
				<main>
					<h2 className='headline'>Log In</h2>

					<div>
						<label>Gender</label>
						<select
							value={gender}
							onChange={(e) => setGender(e.target.value)}>
							<option value=''>Select Gender</option>
							<option value='male'>Male</option>
							<option value='female'>Female</option>
						</select>
					</div>

					<div>
						<label>Date of birth</label>
						<input
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</div>

					<div>
						<p>
							<span>Singned Onece ?</span>
							<br />
							Just Sing In with Google
						</p>
						<button onClick={loginInHandler}>
							<FcGoogle />
							<span>Sing in with Google</span>
						</button>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Login;
