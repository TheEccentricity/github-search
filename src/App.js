import './App.css';
import { useState, useEffect } from 'react';
import { Octokit } from 'octokit';
// require('dotenv').config();

function App() {

	const [input, setInput] = useState('');
	const [type, setType] = useState(null);
	const [user, setUser] = useState('empty')
	const octokit = new Octokit({
		auth: process.env.REACT_APP_TOKEN
	});
	// console.log(octokit);

	const searchClicked = async (param) => {
		if (param.type === null) return alert('Please select a type to search');
		if (param.input === '' || !param.input.length > 0) return alert('Input cannot be empty!');
		console.log(param);
		setUser(null)
		const typeToSearch = param.type === 'User' ? 'users' : 'orgs';
		const searchParam = param.type === 'User' ? { username: 'USERNAME' } : { org: 'ORG' };
		try {
			const result = await octokit.request(`GET /${typeToSearch}/${param.input}`, {
				...searchParam,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});
			if (result.status === 200) {
				console.log(result);
				setUser(result.data)
			} else {
				console.log(result);
			}
		} catch (err) {
			if (err.message.includes("Not Found")) {
				setUser('Not found');
			}
			return console.log("Error", err.message)
		}
		

	}

	const searchQuery = async (param) => {
		if (param === '' || !param.length > 0) return alert('Input cannot be empty!');
		try {
			const result = await octokit.request(`GET /search/users&q=${param}`, {
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});
			if (result.status === 200) {
				console.log(result);
			} else {
				console.log(result)
			}
		}
		catch (err) {
			console.log(err.message);
		}
	}

	function ResultView(props) {
		const { data } = props;
		if (data === 'empty') {
			return <div></div>
		}
		if (data === null) {
			return (
				<div>
					<div>Loading...</div>
				</div>
			)
		}
		if (data === 'Not found') {
			return (
				<div>
					<div className='h5'>Not found</div>
				</div>
			)
		}
		return (
			<div className='d-flex flex-row result'>
				<div>
					<img src={data.avatar_url} width={50} height={'auto'} className='avatar' />
				</div>
				<div>

					{
						data.type === 'User' ?
							<>
								<div className='h5'>{data.name}</div>
								<div>{data.login}</div>
							</>
							:
							<>
								<div className='h5'>{data.login}</div>
							</>
					}
				</div>
			</div>
		)
	}

	return (
		<div className='container main-div'>
			<div className='container-div'>
				<div className='radio-view'>
					<div>
						<input type="radio" name="type" value="User" onClick={(e) => setType(e.target.value)} />
						<label>User</label>
					</div>
					<div>
						<input type="radio" name="type" value="Organization" onClick={(e) => setType(e.target.value)} />
						<label>Organization</label>
					</div>
				</div>
				<div className='mt-8'>
					<input className='input' placeholder='Search for a user or organization' onChange={(e) => setInput(e.target.value)} />
				</div>
				<div style={{ marginTop: 8 }}>
					{/* <button className='btn' onClick={() => searchQuery(input)}>Search</button> */}
					<button className='custom-btn' onClick={() => searchClicked({ input: input, type: type })}>{user === null ? "Please wait..." : 'Search'}</button>
				</div>
				<div style={{ marginTop: 16 }}>
					<ResultView data={user} />
				</div>
			</div>
		</div>
	);
}

export default App;
