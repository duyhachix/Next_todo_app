import '../app/globals.css'; // Nếu bạn có file CSS chung, hãy import ở đây
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Header />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
