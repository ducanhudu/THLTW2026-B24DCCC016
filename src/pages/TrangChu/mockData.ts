export interface BlogPost {
	id: number;
	title: string;
	slug: string;
	description: string;
	content: string;
	publishDate: string;
	createdDate: string;
	author: string;
	tags: string[];
	status: 'draft' | 'published';
	views: number;
	coverImage: string;
}

export const MOCK_POSTS: BlogPost[] = Array.from({ length: 18 }).map((_, i) => ({
	id: i + 1,
	title: `Khám phá Công nghệ Mới: Bài viết số ${i + 1}`,
	slug: `kham-pha-cong-nghe-moi-bai-viet-so-${i + 1}`,
	description:
		'Đây là đoạn mô tả ngắn về bài viết blog, giúp người đọc nắm bắt được nội dung chính trước khi click vào xem chi tiết nội dung đầy đủ của bài viết này.',
	content: `
# Khám phá Công nghệ Mới trong năm 2026

Chào mừng bạn đến với bài viết số ${i + 1} trong chuỗi bài viết về công nghệ. Trong bài viết này, chúng ta sẽ cùng nhau tìm hiểu về những xu hướng mới nhất đang định hình tương lai của ngành lập trình.

## 1. Trí tuệ nhân tạo (AI)
AI không còn là một khái niệm xa vời. Nó hiện diện trong mọi khía cạnh của cuộc sống, từ công cụ tìm kiếm đến các ứng dụng hỗ trợ lập trình như GitHub Copilot.

- **Ưu điểm:** Tăng tốc độ phát triển.
- **Nhược điểm:** Phụ thuộc quá nhiều vào máy móc.

## 2. WebAssembly (Wasm)
WebAssembly đang mở ra một kỷ nguyên mới cho hiệu năng web. Bạn có thể chạy mã C++, Rust trực tiếp trên trình duyệt với tốc độ gần như native.

### Ví dụ về danh sách:
*   Mục thứ nhất
*   Mục thứ hai
*   Mục thứ ba

> "Công nghệ không thay đổi thế giới, chính con người sử dụng công nghệ mới thay đổi thế giới."

Cảm ơn bạn đã đọc bài viết này!
	`,
	publishDate: '21/04/2026',
	createdDate: `0${(i % 9) + 1}/04/2026`,
	author: 'Nguyễn Văn A',
	tags: i % 2 === 0 ? ['Công nghệ', 'Lập trình'] : ['Đời sống', 'Du lịch'],
	status: i % 3 === 0 ? 'draft' : 'published',
	views: 120 + i * 37,
	coverImage: i % 3 === 0 ? '/images/blog_cover.png' : `https://picsum.photos/seed/${i + 10}/800/600`,
}));

export const ALL_TAGS = Array.from(new Set(MOCK_POSTS.flatMap((post) => post.tags)));
