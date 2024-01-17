'use client';
// standard librariess
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../../app/globals.css';
// external libraries
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { FcCancel } from 'react-icons/fc';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Label, TextInput, Select } from 'flowbite-react';

export default function Todo() {
	const router = useRouter();
	// state
	const [user, setUser] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('daily');
	const [todosList, setTodosList] = useState([]);

	const [updatedTitle, setUpdatedTitle] = useState('');
	const [updatedDescription, setUpdatedDescription] = useState('');
	const [updatedStatus, setUpdatedStatus] = useState('');
	const [selectedItem, setSelectedItem] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	let descriptions = ['daily', 'weekly'];

	useEffect(() => {
		if (router.query.user) {
			setUser(JSON.parse(router.query.user));
		}
	}, [router.query.user]);

	useEffect(() => {
		getAllTodos();
	}, []);

	/**
	 * TODO: get the acces token value from local storage
	 * @returns token from local storage
	 */
	function getTokenFromLocalStorage() {
		let token = localStorage.getItem('local_token');
		return token;
	}

	/**
	 * TODO: get all todos item by userId
	 */
	async function getAllTodos() {
		let token = getTokenFromLocalStorage();
		try {
			let response = await axios.get(`http://localhost:8080/todos`, {
				headers: { Authorization: 'Bearer ' + token },
			});
			setTodosList(response.data.data);
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * TODO: add todo item
	 */
	async function handleAddTodo() {
		let todoInfo = {
			title: title,
			description: description,
		};
		let token = getTokenFromLocalStorage();

		try {
			let response = await axios.post(`http://localhost:8080/todos`, todoInfo, {
				headers: { Authorization: 'Bearer ' + token },
			});
			console.log('response', response);
			if (response.data) {
				setTodosList([...todosList, response.data.data]);
				toast.success(response.data?.message, {
					position: 'top-right',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				});
				setTitle('');
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * TODO: delete todo item
	 * @param {*} itemId : id of the item
	 */
	async function handleDeleteTodo(itemId) {
		let token = getTokenFromLocalStorage();
		try {
			let response = await axios.delete(
				`http://localhost:8080/todos/${itemId}`,
				{
					headers: { Authorization: 'Bearer ' + token },
				}
			);
			if (response.data) {
				let filteredTodos = todosList.filter((item) => item.id !== itemId);
				setTodosList(filteredTodos);

				toast.success(response.data?.message, {
					position: 'top-right',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * TODO: update todo item button click event handler
	 */
	async function hangleUpdateTodo() {
		let token = localStorage.getItem('local_token');
		let updatedInfo = {
			title: updatedTitle,
			description: updatedDescription,
			status: updatedStatus,
		};
		try {
			let response = await axios.put(
				`http://localhost:8080/todos/${selectedItem.id}`,
				updatedInfo,
				{
					headers: { Authorization: 'Bearer ' + token },
				}
			);
			if (response.data) {
				let updatedTodos = todosList.map((item) => {
					if (item.id === selectedItem.id) {
						return response.data.data;
					}
					return item;
				});
				// update lists todo
				setTodosList(updatedTodos);
				toast.success(response.data?.message, {
					position: 'top-right',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				});

				setOpenModal(false);
			}
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * TODO: open update item modal
	 * @param {*} todoItem: todo item's details
	 */
	async function handleOpenModal(todoItem) {
		setOpenModal(true);
		setSelectedItem(todoItem);
		setUpdatedTitle(todoItem.title);
		setUpdatedDescription(todoItem.description);
		setUpdatedStatus(todoItem.status);
	}

	return (
		<div className="todo">
			<div className="todo__container bg-grey-100 w-full min-h-screen flex flex-col justify-center items-center p-20">
				<div className="todo__container--card flex flex-col w-fit">
					<div className="input__group flex gap-x-4">
						<TextInput
							type="text"
							placeholder="Enter your todo"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						/>
						<Select
							aria-label="Default select example"
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						>
							<option disabled>Select one item</option>
							{descriptions.map((item, index) => (
								<option key={index} value={item}>
									{item}
								</option>
							))}
						</Select>
						<Button
							onClick={handleAddTodo}
							className={
								!title
									? 'bg-slate-400 disabled:opacity-50 rounded pointer-events-none'
									: 'bg-yellow-300 rounded '
							}
						>
							Add todo
						</Button>
					</div>
					<div className="todo__list mt-2">
						<table className="w-full table-auto">
							<thead>
								<tr className="font-bold text-blue-400 text-xl">
									<th className="border border-slate-300">Title</th>
									<th className="border border-slate-300">Description</th>
									<th className="border border-slate-300">Status</th>
								</tr>
							</thead>
							<tbody>
								{todosList.map((item, index) => (
									<tr
										key={index}
										className="todo__item cursor-pointer"
										onClick={() => {
											handleOpenModal(item);
										}}
									>
										<td className="border border-slate-300 pl-2">
											{item.title}
										</td>
										<td className="border border-slate-300 pl-2">
											{item.description}
										</td>
										<td className="border border-slate-300 pl-2">
											{item.status}
										</td>
										<td>
											<FcCancel
												className="cursor-pointer hover:scale-125 ml-1 m-auto"
												onClick={() => handleDeleteTodo(item.id)}
											></FcCancel>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<Modal
				show={openModal}
				onClose={() => setOpenModal(false)}
				dismissible
				size="md"
			>
				<Modal.Body>
					<div className="space-y-6">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Change todo details{' '}
						</h3>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="email" value="Title" />
							</div>
							<TextInput
								id="email"
								placeholder="New title"
								type="text"
								value={updatedTitle}
								required
								onChange={(e) => {
									setUpdatedTitle(e.target.value);
								}}
							/>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="password" value="Description" />
							</div>
							<Select
								aria-label="Default select example"
								onChange={(e) => {
									setUpdatedDescription(e.target.value);
								}}
							>
								{descriptions.map((item, index) => (
									<option key={index} value={item}>
										{item}
									</option>
								))}
							</Select>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="notDone" value="Description" />
							</div>
							<TextInput
								id="notDone"
								placeholder="New Status"
								type="text"
								value={updatedStatus}
								required
								onChange={(e) => {
									setUpdatedStatus(e.target.value);
								}}
							/>
						</div>
					</div>
				</Modal.Body>

				<Modal.Footer>
					<Button color="gray" onClick={hangleUpdateTodo}>
						Update
					</Button>
					<Button color="blue" onClick={() => setOpenModal(false)}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
			<ToastContainer />
		</div>
	);
}
