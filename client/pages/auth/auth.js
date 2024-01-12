import axios from 'axios';

export default function Auth() {
	async function onResSend() {
		try {
			let response = await axios.get('http://localhost:8080/users/1');
			console.log('Res send', response);
		} catch (error) {
			console.log(error);
		}
	}
	
	async function onReturn() {
		try {
			let response = await axios.get('http://localhost:8080/users/search/1');
			console.log('Return', response);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-24">
			<button
				onClick={() => {
					onResSend();
				}}
			>
				test Res.send function
			</button>

			<button
				onClick={() => {
					onReturn();
				}}
			>
				test Return user
			</button>
		</div>
	);
}
