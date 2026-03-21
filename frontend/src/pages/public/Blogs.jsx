import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getBlogs } from '../../services/blogService';
import { BLOG_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import { FiSearch } from 'react-icons/fi';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchBlogs();
    }, [category, page]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await getBlogs({ category, page, limit: 9 });
            setBlogs(data.blogs || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = search ? blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase())) : blogs;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-gradient-to-r from-primary-500 to-blue-600 py-12 px-4 text-white text-center">
                <h1 className="text-3xl font-bold mb-2">Health Blogs</h1>
                <p className="text-blue-100">Expert health tips and guides from our doctors</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setCategory('')}
                            className={'px-4 py-2 rounded-xl text-sm font-medium transition ' + (!category ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200')}
                        >
                            All
                        </button>
                        {BLOG_CATEGORIES.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => setCategory(c.value)}
                                className={'px-4 py-2 rounded-xl text-sm font-medium transition ' + (category === c.value ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200')}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? <Loader /> : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No blogs found</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((blog) => (
                            <Link key={blog._id} to={'/blogs/' + blog.slug} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden block">
                                {blog.thumbnail && (
                                    <img src={blog.thumbnail} alt={blog.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-300" />
                                )}
                                <div className="p-5">
                                    <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full capitalize">{blog.category}</span>
                                    <h3 className="font-semibold text-gray-800 mt-2 mb-2 line-clamp-2 group-hover:text-primary-500 transition">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <img
                                            src={blog.author?.avatar || 'https://ui-avatars.com/api/?name=' + blog.author?.name + '&background=0ea5e9&color=fff&size=32'}
                                            className="w-6 h-6 rounded-full"
                                            alt={blog.author?.name}
                                        />
                                        <span className="text-xs text-gray-400">{blog.author?.name} · {formatDate(blog.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Blogs;