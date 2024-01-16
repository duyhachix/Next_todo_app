'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../../app/globals.css';

export default function Todo() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [todo, setTodo] = useState('');

	useEffect(() => {
		if (router.query.user) {
			setUser(JSON.parse(router.query.user));
		}
	}, [router.query.user]);

	console.log('todo', user);
	return (
		<div className="todo">
			<div className="bg-grey-100 w-full min-h-screen flex flex-column justify-center items-center p-20">
				<div className="input__group flex">
					<input
						type="text"
						placeholder="Enter your todo"
						className="border border-grey-300 rounded-md p-2"
						value={todo}
						onChange={(e) => {
							setTodo(e.target.value);
						}}
					/>
				</div>
			</div>
		</div>
	);
}
