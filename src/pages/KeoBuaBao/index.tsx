import { Button, Table, Typography, Space } from 'antd';
import { useState, useEffect } from 'react';

const { Title } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';

type History = {
	player: string;
	computer: string;
	result: string;
};

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

export default function KeoBuaBao() {
	const [result, setResult] = useState('');
	const [history, setHistory] = useState<History[]>([]);

	useEffect(() => {
		const data = localStorage.getItem('history');
		if (data) setHistory(JSON.parse(data));
	}, []);

	const saveHistory = (data: History[]) => {
		setHistory(data);
		localStorage.setItem('history', JSON.stringify(data));
	};

	const getResult = (player: Choice, computer: Choice) => {
		if (player === computer) return 'Hòa';

		if (
			(player === 'Kéo' && computer === 'Bao') ||
			(player === 'Búa' && computer === 'Kéo') ||
			(player === 'Bao' && computer === 'Búa')
		)
			return 'Thắng';

		return 'Thua';
	};

	const play = (player: Choice) => {
		const computer = choices[Math.floor(Math.random() * 3)];

		const gameResult = getResult(player, computer);

		setResult(gameResult);

		const newRecord = {
			player,
			computer,
			result: gameResult,
		};

		const newHistory = [newRecord, ...history];

		saveHistory(newHistory);
	};

	const resetHistory = () => {
		localStorage.removeItem('history');
		setHistory([]);
	};

	const columns = [
		{
			title: 'Bạn',
			dataIndex: 'player',
		},
		{
			title: 'Máy',
			dataIndex: 'computer',
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			render: (text: string) => (
				<span
					style={{
						color: text === 'Thắng' ? 'green' : text === 'Thua' ? 'red' : 'orange',
					}}
				>
					{text}
				</span>
			),
		},
	];

	return (
		<div style={{ padding: 30 }}>
			<Title level={2}>Trò chơi Oẳn Tù Tì</Title>

			<Space style={{ marginBottom: 20 }}>
				<Button type='primary' onClick={() => play('Kéo')}>
					✌️ Kéo
				</Button>

				<Button type='primary' onClick={() => play('Búa')}>
					✊ Búa
				</Button>

				<Button type='primary' onClick={() => play('Bao')}>
					✋ Bao
				</Button>
			</Space>

			<h3>
				Kết quả:
				<span
					style={{
						marginLeft: 10,
						color: result === 'Thắng' ? 'green' : result === 'Thua' ? 'red' : 'orange',
					}}
				>
					{result}
				</span>
			</h3>

			<Button danger onClick={resetHistory} style={{ marginBottom: 20 }}>
				Làm mới lịch sử
			</Button>

			<Table dataSource={history} columns={columns} rowKey={(r, i) => i!.toString()} pagination={{ pageSize: 5 }} />
		</div>
	);
}
