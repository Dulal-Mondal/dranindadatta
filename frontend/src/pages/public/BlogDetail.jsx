import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getBlogBySlug, getBlogs } from '../../services/blogService';
import { formatDate } from '../../utils/formatDate';
import { FiArrowLeft, FiClock, FiEye, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) fetchBlog();
    }, [slug]);

    const fetchBlog = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getBlogBySlug(slug);
            setBlog(data.blog);

            // related blogs fetch
            const relatedRes = await getBlogs({
                category: data.blog.category,
                limit: 3,
            });
            const filtered = (relatedRes.data.blogs || []).filter(
                (b) => b._id !== data.blog._id
            );
            setRelatedBlogs(filtered.slice(0, 3));
        } catch (err) {
            setError(err.response?.data?.message || 'Blog not found');
        } finally {
            setLoading(false);
        }
    };

    // reading time calculate
    const readingTime = (content) => {
        if (!content) return 1;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Loader fullScreen />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
                    <p className="text-gray-500 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
                    <Link to="/blogs" className="btn-primary">
                        ← Back to Blogs
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero / Thumbnail */}
            {blog.thumbnail && (
                <div className="w-full h-64 md:h-96 overflow-hidden">
                    <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 py-10">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition mb-6"
                >
                    <FiArrowLeft size={16} /> Back to Blogs
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">

                    {/* Category */}
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-600 text-xs font-medium px-3 py-1.5 rounded-full capitalize">
                            <FiTag size={11} /> {blog.category?.replace('-', ' ')}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                        {blog.title}
                    </h1>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100 mb-8">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <img
                                src={
                                    blog.author?.avatar ||
                                    `https://ui-avatars.com/api/?name=${blog.author?.name}&background=0ea5e9&color=fff&size=40`
                                }
                                alt={blog.author?.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                                <span className="font-medium text-gray-700">{blog.author?.name}</span>
                                <span className="ml-1 text-xs text-gray-400 capitalize">({blog.author?.role})</span>
                            </div>
                        </div>

                        <span className="flex items-center gap-1">
                            <FiCalendar size={13} /> {formatDate(blog.createdAt)}
                        </span>

                        <span className="flex items-center gap-1">
                            <FiClock size={13} /> {readingTime(blog.content)} min read
                        </span>

                        {blog.views > 0 && (
                            <span className="flex items-center gap-1">
                                <FiEye size={13} /> {blog.views} views
                            </span>
                        )}
                    </div>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p className="text-lg text-gray-600 italic border-l-4 border-primary-400 pl-4 mb-8 leading-relaxed">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Blog Content */}
                    <div
                        className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-800
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700
              prose-strong:text-gray-800
              prose-blockquote:border-primary-400 prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-500 mb-3">Tags:</p>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Author Box */}
                    <div className="mt-10 bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
                        <img
                            src={
                                blog.author?.avatar ||
                                `https://ui-avatars.com/api/?name=${blog.author?.name}&background=0ea5e9&color=fff&size=80`
                            }
                            alt={blog.author?.name}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Written by</p>
                            <p className="font-bold text-gray-800">{blog.author?.name}</p>
                            <p className="text-sm text-primary-500 capitalize">{blog.author?.role}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Expert health content contributor at Dr. Aninda Datta Telemedicine Platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((b) => (
                                <Link
                                    key={b._id}
                                    to={`/blogs/${b.slug}`}
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group"
                                >
                                    {b.thumbnail && (
                                        <img
                                            src={b.thumbnail}
                                            alt={b.title}
                                            className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    )}
                                    <div className="p-4">
                                        <span className="text-xs text-primary-500 capitalize">
                                            {b.category?.replace('-', ' ')}
                                        </span>
                                        <h4 className="font-semibold text-gray-800 mt-1 text-sm line-clamp-2 group-hover:text-primary-500 transition">
                                            {b.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 mt-2">{formatDate(b.createdAt)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to all blogs */}
                <div className="text-center mt-12">
                    <Link to="/blogs" className="btn-outline inline-flex items-center gap-2">
                        <FiArrowLeft size={15} /> View All Blogs
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BlogDetail;