'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
	const router = useRouter();

	useEffect(() => {
		router.push('/auth');
	}, []);

	// Trang mặc định có thể không cần phải hiển thị nội dung gì cả
	return null;
};

export default HomePage;
