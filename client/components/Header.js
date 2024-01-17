'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (router.query.user) {
			setUser(JSON.parse(router.query.user));
			console.log();
		}
	}, [router.query.user]);

	return (
		<div className="header bg-slate-200 h-10 p-2">
			<div className="container flex justify-between">
				<div className="logo">Todo App</div>
				<div className="menu">
					Hello: <span>{user ? user.username : ''}</span>
				</div>
			</div>
		</div>
	);
}
