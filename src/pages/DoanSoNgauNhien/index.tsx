import React, { useState } from 'react';
import { Card, InputNumber, Button, Typography, message, List } from 'antd';

const { Title, Text } = Typography;

const MAX_ATTEMPT = 10;

const DoanSoNgauNhien: React.FC = () => {
	const [randomNumber, setRandomNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
	const [guess, setGuess] = useState<number | null>(null);
	const [attempt, setAttempt] = useState<number>(0);
	const [history, setHistory] = useState<number[]>([]);
	const [isGameOver, setIsGameOver] = useState<boolean>(false);

	const handleGuess = () => {
		if (guess === null) {
			message.warning('Hãy nhập số!');
			return;
		}

		if (isGameOver) {
			message.warning('Bạn đã thất bại');
			return;
		}

		const newAttempt = attempt + 1;
		setAttempt(newAttempt);
		setHistory([...history, guess]);

		if (guess === randomNumber) {
			message.success(`Đúng rồi! Bạn đoán trúng sau ${newAttempt} lần!`);
			setIsGameOver(true);
			return;
		}

		if (newAttempt >= MAX_ATTEMPT) {
			message.error(`Hết lượt! Số đúng là ${randomNumber}`);
			setIsGameOver(true);
			return;
		}

		if (guess > randomNumber) {
			message.info('Số bạn đoán lớn hơn rồi!');
		} else {
			message.info('Số bạn đoán nhỏ hơn rồi!');
		}
	};

	const handleReset = () => {
		setRandomNumber(Math.floor(Math.random() * 100) + 1);
		setGuess(null);
		setAttempt(0);
		setHistory([]);
		setIsGameOver(false);
		message.success('Game mới bắt đầu!');
	};

	return (
		<Card style={{ maxWidth: 500, margin: '50px auto', textAlign: 'center' }}>
			<Title level={2}>Game Đoán Số</Title>
			<Text>Đoán số từ 1 đến 100 (tối đa {MAX_ATTEMPT} lần)</Text>

			<div style={{ marginTop: 20 }}>
				<InputNumber
					min={1}
					max={100}
					value={guess ?? undefined}
					onChange={(value) => setGuess(value)}
					disabled={isGameOver}
					style={{ width: '100%' }}
				/>
			</div>

			<div style={{ marginTop: 20 }}>
				<Button type='primary' onClick={handleGuess} disabled={isGameOver} style={{ marginRight: 10 }}>
					Đoán
				</Button>

				<Button danger onClick={handleReset}>
					Reset
				</Button>
			</div>

			<div style={{ marginTop: 20 }}>
				<Text>
					Số lần đã đoán: {attempt} / {MAX_ATTEMPT}
				</Text>
			</div>

			<div style={{ marginTop: 20, textAlign: 'left' }}>
				<Title level={5}>Lịch sử đoán:</Title>
				<List
					bordered
					dataSource={history}
					renderItem={(item, index) => (
						<List.Item>
							Lần {index + 1}: {item}
						</List.Item>
					)}
				/>
			</div>
		</Card>
	);
};

export default DoanSoNgauNhien;
