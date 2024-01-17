'use client';
import '../../app/globals.css';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
	const [user, setUser] = useState(null);
	const [isLoginForm, setIsLoginForm] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newUsername, setNewUsername] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const router = useRouter();

	async function handleLogin(e) {
		e.preventDefault();
		let loginInfo = {
			email,
			password,
		};

		try {
			let response = await axios.post(
				`http://localhost:8080/auth/signin`,
				loginInfo
			);
			console.log('response', response);
			let loggedUser = response.data.authUser;
			if (!loggedUser) return;
			else {
				let token = loggedUser.access_token;
				let localToken = localStorage.setItem('local_token', token);
				let user = response.data.authUser;
				setUser(user);
				toast.success(response.data?.message, {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				});
				setEmail('');
				setPassword('');

				router.push({
					pathname: '/todo',
					query: { user: JSON.stringify(user) },
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function handleSignup(e) {
		e.preventDefault();
		let signupInfo = {
			email: newEmail,
			username: newUsername,
			password: newPassword,
		};

		try {
			let response = await axios.post(
				`http://localhost:8080/users/signup`,
				signupInfo
			);
			if (response.status === 200) {
				toast.success(response.data?.message, {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				});
				setIsLoginForm(true);
			}
		} catch (error) {
			console.log(error);
		}
		console.log('signup info', signupInfo);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-10">
			{isLoginForm ? (
				// login form
				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form className="space-y-6" action="#" onSubmit={handleLogin}>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										required
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
										}}
										className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Password
									</label>
									<div className="text-sm">
										<a
											href="#"
											className="font-semibold text-indigo-600 hover:text-indigo-500"
										>
											Forgot password?
										</a>
									</div>
								</div>
								<div className="mt-2">
									<input
										required
										type="password"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
										}}
										className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Sign in
								</button>
							</div>
						</form>

						<p className="mt-10 text-center text-sm text-gray-500">
							Not a member?{' '}
							<a
								href="#"
								className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
								onClick={() => {
									setIsLoginForm(false);
								}}
							>
								Sign up
							</a>
						</p>
					</div>
				</div>
			) : (
				// sign up form
				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
							Sign up a your new accout
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form className="space-y-6" action="#" onSubmit={handleSignup}>
							<div>
								<label
									htmlFor="newUsername"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Username
								</label>
								<div className="mt-2">
									<input
										required
										type="text"
										value={newUsername}
										onChange={(e) => {
											setNewUsername(e.target.value);
										}}
										className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="newEmail"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										required
										type="email"
										value={newEmail}
										onChange={(e) => {
											setNewEmail(e.target.value);
										}}
										className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="newPassword"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Password
									</label>
								</div>
								<div className="mt-2">
									<input
										required
										type="password"
										value={newPassword}
										onChange={(e) => {
											setNewPassword(e.target.value);
										}}
										className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Sign up
								</button>
							</div>
						</form>

						<p className="mt-10 text-center text-sm text-gray-500">
							Already have an account ?{' '}
							<a
								href="#"
								className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
								onClick={() => {
									setIsLoginForm(true);
								}}
							>
								Sign in
							</a>
						</p>
					</div>
				</div>
			)}
			<ToastContainer />
		</main>
	);
}
