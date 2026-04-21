import { ArrowLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Row, Typography } from 'antd';
import { Link } from 'umi';
import './components/style.less';

const { Title, Paragraph, Text } = Typography;

const skills = ['React', 'TypeScript', 'Ant Design', 'UmiJS', 'REST API', 'Responsive UI'];

const socialLinks = [
    {
        label: 'Email',
        value: 'nguyenvana.dev@example.com',
        href: 'mailto:nguyenvana.dev@example.com',
    },
    {
        label: 'GitHub',
        value: 'github.com/nguyenvana',
        href: 'https://github.com/nguyenvana',
    },
    {
        label: 'LinkedIn',
        value: 'linkedin.com/in/nguyenvana',
        href: 'https://linkedin.com/in/nguyenvana',
    },
];

const AboutPage = () => {
    return (
        <div className='blog-container about-page'>
            <Link to='/dashboard'>
                <Button className='red-action-button' icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
                    Quay lại Trang chủ
                </Button>
            </Link>

            <Card className='profile-card'>
                <div className='profile-hero'>
                    <Avatar className='profile-avatar' size={120}>
                        NA
                    </Avatar>
                    <div className='profile-summary'>
                        <Title level={2} className='profile-name'>
                            Nguyen Van A
                        </Title>
                        <div className='profile-role'>Tác giả của những Blog hiện đại</div>
                        <Paragraph className='profile-bio'>
                            Tôi là một người yêu thích viết lách, thích ghi lại những suy nghĩ, trải nghiệm và góc nhìn của mình về công nghệ và cuộc sống. Mỗi bài viết là một cách để tôi học hỏi, chia sẻ và kết nối với những người có cùng mối quan tâm.
                        </Paragraph>
                    </div>
                </div>
            </Card>

            <Divider />

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card className='section-card'>
                        <Title level={4} className='section-title'>
                            Kỹ năng
                        </Title>
                        <div className='skills-grid'>
                            {skills.map((skill) => (
                                <div key={skill} className='skill-pill'>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card className='section-card'>
                        <Title level={4} className='section-title'>
                            Liên kết mạng xã hội
                        </Title>
                        <div className='social-list'>
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    className='social-link'
                                    href={link.href}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    <Text>{link.label}</Text>
                                    <span>{link.value}</span>
                                </a>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AboutPage;