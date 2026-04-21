import { Button, Card, Col, Input, Pagination, Row, Space, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'umi';
import './components/style.less';
import { ALL_TAGS, MOCK_POSTS } from './mockData';

const { Title, Text, Paragraph } = Typography;
const { CheckableTag } = Tag;

const TrangChu = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const pageSize = 9;

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(searchTerm);
		}, 300);
		return () => clearTimeout(handler);
	}, [searchTerm]);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch, selectedTag]);

	const filteredPosts = useMemo(() => {
		return MOCK_POSTS.filter((post) => {
			const matchesSearch = post.title.toLowerCase().includes(debouncedSearch.toLowerCase());
			const matchesTag = !selectedTag || post.tags.includes(selectedTag);
			return matchesSearch && matchesTag;
		});
	}, [debouncedSearch, selectedTag]);

	const currentPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	return (
		<div className='blog-container'>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
				<div>
					<Title level={2} style={{ marginBottom: 8 }}>
						TIN TỨC MỚI NHẤT
					</Title>
					<Text type='secondary'>Xem bài viết, quản lý nội dung, quản lý thẻ và truy cập thông tin tác giả.</Text>
				</div>
				<Space wrap>
					<Link to='/dashboard/blog-manager'>
						<Button className='red-action-button'>Quản lý bài viết</Button>
					</Link>
					<Link to='/dashboard/tag-manager'>
						<Button className='red-action-button'>Quản lý thẻ</Button>
					</Link>
					<Link to='/dashboard/about'>
						<Button type='primary'>Chi tiết tác giả</Button>
					</Link>
				</Space>
			</div>

			<div className='filter-section'>
				<Row gutter={[16, 16]} align='middle' justify='space-between'>
					<Col xs={24} md={8}>
						<Input
							placeholder='Tìm kiếm bài viết...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} md={16} style={{ textAlign: 'right' }}>
						<div className='tag-filters'>
							<Text strong style={{ marginRight: 12 }}>
								Lọc theo thẻ:
							</Text>
							<CheckableTag checked={!selectedTag} onChange={() => setSelectedTag(null)}>
								Tất cả
							</CheckableTag>
							{ALL_TAGS.map((tag) => (
								<CheckableTag
									key={tag}
									checked={selectedTag === tag}
									onChange={(checked) => setSelectedTag(checked ? tag : null)}
								>
									{tag}
								</CheckableTag>
							))}
						</div>
					</Col>
				</Row>
			</div>

			<Row gutter={[24, 24]}>
				{currentPosts.map((post) => (
					<Col key={post.id} xs={24} sm={12} md={8}>
						<Link to={`/dashboard/${post.id}`}>
							<Card
								hoverable
								className='blog-card'
								cover={<img alt={post.title} src={post.coverImage} />}
							>
								<div className='card-content'>
									<div>
										{post.tags.map((tag) => (
											<Tag key={tag} color='blue' style={{ marginBottom: 8 }}>
												{tag}
											</Tag>
										))}
									</div>
									<Title level={4} className='post-title'>
										{post.title}
									</Title>
									<Paragraph className='post-description'>{post.description}</Paragraph>
								</div>
								<div className='card-footer'>
									<Text strong>{post.author}</Text>
									<Text>{post.publishDate}</Text>
								</div>
							</Card>
						</Link>
					</Col>
				))}
			</Row>

			{filteredPosts.length > 0 && (
				<div className='pagination-wrapper'>
					<Pagination
						current={currentPage}
						pageSize={pageSize}
						total={filteredPosts.length}
						onChange={(page) => setCurrentPage(page)}
						showSizeChanger={false}
					/>
				</div>
			)}
		</div>
	);
};

export default TrangChu;
