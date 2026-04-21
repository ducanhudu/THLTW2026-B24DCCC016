import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { Link } from 'umi';
import './components/style.less';
import { ALL_TAGS, BlogPost, MOCK_POSTS } from './mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

type BlogFormValues = {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    tags: string[];
    status: 'draft' | 'published';
};

const BlogManager = () => {
    const [form] = Form.useForm<BlogFormValues>();
    const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = !statusFilter || post.status === statusFilter;
            return matchTitle && matchStatus;
        });
    }, [posts, searchTerm, statusFilter]);

    const handleOpenCreate = () => {
        setEditingPost(null);
        form.resetFields();
        form.setFieldsValue({
            title: '',
            slug: '',
            content: '',
            coverImage: '',
            tags: [],
            status: 'draft',
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (post: BlogPost) => {
        setEditingPost(post);
        form.setFieldsValue({
            title: post.title,
            slug: post.slug,
            content: post.content,
            coverImage: post.coverImage,
            tags: post.tags,
            status: post.status,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
    };

    const handleSubmit = (values: BlogFormValues) => {
        if (editingPost) {
            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === editingPost.id
                        ? {
                            ...post,
                            ...values,
                            description: values.content.slice(0, 140),
                            publishDate: values.status === 'published' ? post.publishDate : post.publishDate,
                        }
                        : post,
                ),
            );
        } else {
            const newPost: BlogPost = {
                id: Date.now(),
                title: values.title,
                slug: values.slug,
                description: values.content.slice(0, 140),
                content: values.content,
                publishDate: '21/04/2026',
                createdDate: '21/04/2026',
                author: 'Nguyễn Văn A',
                tags: values.tags,
                status: values.status,
                views: 0,
                coverImage: values.coverImage,
            };

            setPosts((currentPosts) => [newPost, ...currentPosts]);
        }

        setIsModalOpen(false);
        setEditingPost(null);
        form.resetFields();
    };

    const columns: ColumnsType<BlogPost> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: BlogPost['status']) => (
                <Tag color={status === 'published' ? 'blue' : 'default'}>
                    {status === 'published' ? 'Published' : 'Draft'}
                </Tag>
            ),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (
                <Space size={[0, 8]} wrap>
                    {tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleOpenEdit(record)}>Edit</Button>
                    <Popconfirm
                        title='Delete this blog post?'
                        okText='Delete'
                        cancelText='Cancel'
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className='blog-container blog-manager-page'>
            <Link to='/dashboard'>
                <Button className='red-action-button' icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
                    Quay lại Trang chủ
                </Button>
            </Link>

            <Card className='manager-hero-card'>
                <div className='manager-hero'>
                    <div>
                        <Title level={2}>Quản lý bài viết</Title>
                        <Text type='secondary'>Quản lý danh sách bài viết, cập nhật nội dung và theo dõi trạng thái xuất bản.</Text>
                    </div>
                    <Button type='primary' onClick={handleOpenCreate}>
                        Create Blog
                    </Button>
                </div>
            </Card>

            <Card className='manager-filter-card'>
                <Space size={[16, 16]} wrap className='manager-filters'>
                    <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder='Search by title'
                        allowClear
                        style={{ width: 280 }}
                    />
                    <Select
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        placeholder='Filter by status'
                        allowClear
                        style={{ width: 220 }}
                        options={[
                            { label: 'Draft', value: 'draft' },
                            { label: 'Published', value: 'published' },
                        ]}
                    />
                </Space>
            </Card>

            <Card className='manager-table-card'>
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={filteredPosts}
                    bordered
                    pagination={{ pageSize: 6 }}
                />
            </Card>

            <Modal
                title={editingPost ? 'Edit Blog' : 'Create Blog'}
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingPost(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                width={760}
                destroyOnClose
            >
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label='Title'
                        name='title'
                        rules={[{ required: true, message: 'Please enter the blog title' }]}
                    >
                        <Input placeholder='Enter blog title' />
                    </Form.Item>

                    <Form.Item
                        label='Slug'
                        name='slug'
                        rules={[{ required: true, message: 'Please enter the slug' }]}
                    >
                        <Input placeholder='enter-blog-slug' />
                    </Form.Item>

                    <Form.Item
                        label='Content'
                        name='content'
                        rules={[{ required: true, message: 'Please enter the content' }]}
                    >
                        <TextArea rows={8} placeholder='Write blog content' />
                    </Form.Item>

                    <Form.Item
                        label='Cover Image URL'
                        name='coverImage'
                        rules={[{ required: true, message: 'Please enter the cover image URL' }]}
                    >
                        <Input placeholder='https://example.com/cover-image.jpg' />
                    </Form.Item>

                    <Form.Item
                        label='Tags'
                        name='tags'
                        rules={[{ required: true, message: 'Please add at least one tag' }]}
                    >
                        <Select
                            mode='tags'
                            placeholder='Add tags'
                            options={ALL_TAGS.map((tag) => ({ label: tag, value: tag }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Status'
                        name='status'
                        rules={[{ required: true, message: 'Please choose the status' }]}
                    >
                        <Select
                            options={[
                                { label: 'Draft', value: 'draft' },
                                { label: 'Published', value: 'published' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogManager;