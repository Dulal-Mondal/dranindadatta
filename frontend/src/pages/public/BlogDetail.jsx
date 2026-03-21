import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getBlogBySlug } from '../../services/blogService';
import { formatDate } from '../../utils/formatDate';
import { FiArrowLeft, FiCalendar, FiEye } from 'react-icons/fi';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    const fetchBlog = async () => {
        try {
            const { data } = await getBlogBySlug(slug);
            setBlog(data.blog);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <><Navbar /><Loader fullScreen /></>;

    if (!blog) return (
        <><Navbar />
            <div className="text-center py-20 text-gray-400">Blog not found</div>
            <Footer /></>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <Link to="/blogs" className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition mb-6 text-sm">
                    <FiArrowLeft size={16} /> Back to Blogs
                </Link>

                {blog.thumbnail && (
                    <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
                )}

                <span className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full capitalize">{blog.category}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3 mb-4">{blog.title}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <img
                            src={blog.author?.avatar || 'https://ui-avatars.com/api/?name=' + blog.author?.name + '&background=0ea5e9&color=fff&size=32'}
                            className="w-7 h-7 rounded-full"
                            alt={blog.author?.name}
                        />
                        <span>{blog.author?.name}</span>
                    </div>
                    <span className="flex items-center gap-1"><FiCalendar size={13} />{formatDate(blog.createdAt)}</span>
                    <span className="flex items-center gap-1"><FiEye size={13} />{blog.views} views</span>
                </div>

                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {blog.content}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BlogDetail;