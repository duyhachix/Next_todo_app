'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../../app/globals.css';
import { Form } from 'react-bootstrap';

export default function Todo() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [todo, setTodo] = useState('');
	const [todosList, setTodosList] = useState([]);

	let descriptions = ['daily', 'weekly'];

	useEffect(() => {
		if (router.query.user) {
			setUser(JSON.parse(router.query.user));
		}
	}, [router.query.user]);

	useEffect(() => {
		getAllTodos();
	}, []);

	async function getAllTodos() {
		let token = localStorage.getItem('local_token');
		try {
			let response = await axios.get(`http://localhost:8080/todos`, {
				headers: { Authorization: 'Bearer ' + token },
			});
			console.log('response', response);
			setTodosList(response.data.data);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleAddTodo() {
		let todoInfo = {
			todo,
			userId: user.id,
		};
		try {
			let response = await axios.post(`http://localhost:8080/todos`, todoInfo);
			console.log('response', response);
			setTodo('');
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="todo">
			<div className="todo__container bg-grey-100 w-full min-h-screen flex flex-col justify-center items-center p-20">
				<div className="todo__container--card flex flex-col w-fit">
					<div className="input__group flex gap-x-4">
						<input
							type="text"
							placeholder="Enter your todo"
							className="border border-grey-300 rounded-md p-2"
							value={todo}
							onChange={(e) => {
								setTodo(e.target.value);
							}}
						/>
						<Form.Select
							className="border border-grey-300"
							aria-label="Default select example"
						>
							<option disabled>Select one item</option>
							{descriptions.map((item, index) => (
								<option key={index} value={item}>
									{item}
								</option>
							))}
						</Form.Select>
						<button
							onClick={handleAddTodo}
							className="bg-blue-500 text-white rounded p-2 ml-2"
						>
							Add todo
						</button>
					</div>
					<div className="todo__list mt-2">
						<table className="w-full table-auto">
							<thead>
								<tr className="font-bold text-red-400 text-xl">
									<th className="border border-slate-300">Title</th>
									<th className="border border-slate-300">Description</th>
									<th className="border border-slate-300">Status</th>
								</tr>
							</thead>
							<tbody>
								{todosList.map((item, index) => (
									<tr key={index}>
										<td className="border border-slate-300 pl-2">
											{item.title}
										</td>
										<td className="border border-slate-300 pl-2">
											{item.description}
										</td>
										<td className="border border-slate-300 pl-2">
											{item.status}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* <div className="todo__list flex flex-col">
						<div className="todo__list--header flex gap-x-2">
							<h2> Title</h2>
							<h2>Description</h2>
							<h2>Status</h2>s
						</div>
						{todosList.map((item, index) => (
							<div key={index} className="todo__item flex gap-x-2">
								<h3>{item.title}</h3>
								<p>{item.description}</p>
								<p>{item.status}</p>
							</div>
						))}
					</div> */}
				</div>
			</div>
		</div>
	);
}
