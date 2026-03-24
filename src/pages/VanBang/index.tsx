import { Tabs } from 'antd';
import { useEffect, useState } from 'react';

import SoVanBang from './soVanBang';
import QuyetDinh from './quyetDinh';
import MauBieu from './bieuMau';
import ThongTinVanBang from './thongTin';
import TraCuu from './traCuu';

const { TabPane } = Tabs;

export default function VanBangApp() {
	const [quyetDinhList, setQuyetDinhList] = useState<any[]>([]);
	const [vanBangList, setVanBangList] = useState<any[]>([]);
	const [mauBieu, setMauBieu] = useState<any[]>([]);

	useEffect(() => {
		const vb = localStorage.getItem('vanBang');
		const qd = localStorage.getItem('quyetDinh');
		const mb = localStorage.getItem('mauBieu');

		if (vb) setVanBangList(JSON.parse(vb));
		if (qd) setQuyetDinhList(JSON.parse(qd));
		if (mb) setMauBieu(JSON.parse(mb));
	}, []);

	useEffect(() => {
		localStorage.setItem('vanBang', JSON.stringify(vanBangList));
	}, [vanBangList]);

	useEffect(() => {
		localStorage.setItem('quyetDinh', JSON.stringify(quyetDinhList));
	}, [quyetDinhList]);

	useEffect(() => {
		localStorage.setItem('mauBieu', JSON.stringify(mauBieu));
	}, [mauBieu]);

	return (
		<div style={{ padding: 24 }}>
			<h1>Hệ thống quản lý văn bằng</h1>

			<Tabs defaultActiveKey='1'>
				<TabPane tab='Sổ văn bằng' key='1'>
					<SoVanBang vanBangList={vanBangList} />
				</TabPane>

				<TabPane tab='Quyết định' key='2'>
					<QuyetDinh list={quyetDinhList} setList={setQuyetDinhList} />
				</TabPane>

				<TabPane tab='Biểu mẫu' key='3'>
					<MauBieu list={mauBieu} setList={setMauBieu} />
				</TabPane>

				<TabPane tab='Thông tin VB' key='4'>
					<ThongTinVanBang
						list={vanBangList}
						setList={setVanBangList}
						quyetDinhList={quyetDinhList}
						mauBieu={mauBieu}
					/>
				</TabPane>

				<TabPane tab='Tra cứu' key='5'>
					<TraCuu vanBangList={vanBangList} quyetDinhList={quyetDinhList} mauBieu={mauBieu} />
				</TabPane>
			</Tabs>
		</div>
	);
}
