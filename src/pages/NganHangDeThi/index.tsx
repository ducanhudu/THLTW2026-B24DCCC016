import { Tabs } from 'antd';
import Knowledge from './khoiKienThuc';
import Subjects from './monHoc';
import Questions from './cauHoi';
import Exams from './deThi';

const { TabPane } = Tabs;

export default function QuestionBank() {
	return (
		<div style={{ padding: 24 }}>
			<h1>Hệ thống ngân hàng câu hỏi</h1>

			<Tabs defaultActiveKey='1'>
				<TabPane tab='Khối kiến thức' key='1'>
					<Knowledge />
				</TabPane>

				<TabPane tab='Môn học' key='2'>
					<Subjects />
				</TabPane>

				<TabPane tab='Câu hỏi' key='3'>
					<Questions />
				</TabPane>

				<TabPane tab='Đề thi' key='4'>
					<Exams />
				</TabPane>
			</Tabs>
		</div>
	);
}
