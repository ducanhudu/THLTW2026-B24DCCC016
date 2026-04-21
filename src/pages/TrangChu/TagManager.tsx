import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { Link } from 'umi';
import './components/style.less';
import { ALL_TAGS, BlogPost, MOCK_POSTS } from './mockData';

const { Title, Text } = Typography;

type TagRecord = {
    id: string;
    name: string;
    postCount: number;
};

type TagFormValues = {
    name: string;
};

const createInitialPosts = (): BlogPost[] => MOCK_POSTS.map((post) => ({ ...post, tags: [...post.tags] }));

const TagManager = () => {
    const [form] = Form.useForm<TagFormValues>();
    const [posts, setPosts] = useState<BlogPost[]>(createInitialPosts);
    const [tags, setTags] = useState<string[]>(ALL_TAGS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<string | null>(null);

    const tagData = useMemo<TagRecord[]>(() => {
        return tags
            .map((tag) => ({
                id: tag,
                name: tag,
                postCount: posts.filter((post) => post.tags.includes(tag)).length,
            }))
            .filter((tag) => tag.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
            .sort((left, right) => left.name.localeCompare(right.name));
    }, [posts, searchTerm, tags]);

    const resetModal = () => {
        setIsModalOpen(false);
        setEditingTag(null);
        form.resetFields();
    };

    const handleOpenCreate = () => {
        setEditingTag(null);
        form.setFieldsValue({ name: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (tagName: string) => {
        setEditingTag(tagName);
        form.setFieldsValue({ name: tagName });
        setIsModalOpen(true);
    };

    const handleDelete = (tagName: string) => {
        setTags((currentTags) => currentTags.filter((tag) => tag !== tagName));
        setPosts((currentPosts) =>
            currentPosts.map((post) => ({
                ...post,
                tags: post.tags.filter((tag) => tag !== tagName),
            })),
        );
    };

    const handleSubmit = (values: TagFormValues) => {
        const normalizedName = values.name.trim();

        if (editingTag) {
            setTags((currentTags) => currentTags.map((tag) => (tag === editingTag ? normalizedName : tag)));
            setPosts((currentPosts) =>
                currentPosts.map((post) => ({
                    ...post,
                    tags: post.tags.map((tag) => (tag === editingTag ? normalizedName : tag)),
                })),
            );
        } else {
            setTags((currentTags) => [normalizedName, ...currentTags]);
        }

        resetModal();
    };

    const columns: ColumnsType<TagRecord> = [
        {
            title: 'Tag name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Tag>{name}</Tag>,
        },
        {
            title: 'Posts using tag',
            dataIndex: 'postCount',
            key: 'postCount',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleOpenEdit(record.name)}>Edit</Button>
                    <Popconfirm
                        title='Delete this tag?'
                        description='This tag will be removed from all posts.'
                        okText='Delete'
                        cancelText='Cancel'
                        onConfirm={() => handleDelete(record.name)}
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
                        <Title level={2}>Quản lý thẻ</Title>
                        <Text type='secondary'>Tạo mới, cập nhật và xóa thẻ, đồng thời theo dõi số bài viết đang sử dụng từng thẻ.</Text>
                    </div>
                    <Button type='primary' onClick={handleOpenCreate}>
                        Create Tag
                    </Button>
                </div>
            </Card>

            <Card className='manager-filter-card'>
                <Space size={[16, 16]} wrap className='manager-filters'>
                    <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder='Search by tag name'
                        allowClear
                        style={{ width: 280 }}
                    />
                </Space>
            </Card>

            <Card className='manager-table-card'>
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={tagData}
                    bordered
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title={editingTag ? 'Edit Tag' : 'Create Tag'}
                visible={isModalOpen}
                onCancel={resetModal}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label='Tag name'
                        name='name'
                        rules={[
                            { required: true, message: 'Please enter the tag name' },
                            () => ({
                                validator(_, value) {
                                    const normalizedName = String(value || '').trim();
                                    const duplicatedTag = tags.find(
                                        (tag) => tag.toLowerCase() === normalizedName.toLowerCase() && tag !== editingTag,
                                    );

                                    if (!normalizedName) {
                                        return Promise.resolve();
                                    }

                                    if (duplicatedTag) {
                                        return Promise.reject(new Error('This tag already exists'));
                                    }

                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input placeholder='Enter tag name' maxLength={40} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TagManager;