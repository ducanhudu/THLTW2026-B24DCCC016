import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { history, useParams, Link } from 'umi';
import './components/style.less';
import { MOCK_POSTS } from './mockData';

const { Title, Text, Paragraph } = Typography;

const DetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const [viewCount, setViewCount] = useState(0);

	const post = useMemo(() => MOCK_POSTS.find((p) => p.id === Number(id)), [id]);

	useEffect(() => {
		if (post) {
			const storageKey = `blog_views_${post.id}`;
			const storedViews = Number(localStorage.getItem(storageKey) || 0);
			const newViews = storedViews + 1;
			localStorage.setItem(storageKey, newViews.toString());
			setViewCount(newViews);
		}
	}, [post]);

	if (!post) {
		return (
			<div className='blog-container'>
				<Title level={3}>Không tìm thấy bài viết</Title>
				<Button onClick={() => history.push('/dashboard')}>Quay lại trang chủ</Button>
			</div>
		);
	}

	const relatedPosts = MOCK_POSTS.filter(
		(p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag)),
	).slice(0, 3);

	return (
		<div className='blog-container detail-page'>
			<div style={{ marginBottom: 24 }}>
				<Button onClick={() => history.push('/dashboard')} size='large'>
					Quay lại
				</Button>
			</div>

			<Card className='main-post-card'>
				<div className='post-header'>
					<div className='post-meta-top'>
						<Space split={<Divider type='vertical' />}>
							<Text type='secondary'>{post.publishDate}</Text>
							<Text type='secondary'>Tác giả: {post.author}</Text>
							<Text type='secondary'>Lượt xem: {viewCount}</Text>
						</Space>
					</div>

					<Title level={1} className='detail-title'>
						{post.title}
					</Title>

					<div style={{ marginBottom: 24 }}>
						{post.tags.map((tag) => (
							<Tag key={tag} color='blue'>
								{tag}
							</Tag>
						))}
					</div>

					<div className='detail-cover'>
						<img src={post.coverImage} alt={post.title} />
					</div>
				</div>

				<Divider />

				<div className='post-content'>
					<ReactMarkdown>{post.content}</ReactMarkdown>
				</div>
			</Card>

			<div className='related-section' style={{ marginTop: 64 }}>
				<Title level={3} style={{ marginBottom: 32 }}>
					Bài viết liên quan
				</Title>
				<Row gutter={[24, 24]}>
					{relatedPosts.map((related) => (
						<Col key={related.id} xs={24} sm={12} md={8}>
							<Link to={`/dashboard/${related.id}`}>
								<Card
									hoverable
									size='small'
									cover={
										<img
											alt={related.title}
											src={related.coverImage}
											style={{ height: 140, objectFit: 'cover' }}
										/>
									}
								>
									<Title level={5} style={{ fontSize: 16 }}>
										{related.title}
									</Title>
									<Text type='secondary' style={{ fontSize: 12 }}>
										{related.publishDate}
									</Text>
								</Card>
							</Link>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

export default DetailPage;
