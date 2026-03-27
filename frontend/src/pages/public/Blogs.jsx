// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';
// import Loader from '../../components/common/Loader';
// import { getBlogs } from '../../services/blogService';
// import { BLOG_CATEGORIES } from '../../utils/constants';
// import { formatDate } from '../../utils/formatDate';
// import { FiSearch } from 'react-icons/fi';

// const Blogs = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [category, setCategory] = useState('');
//     const [search, setSearch] = useState('');
//     const [page, setPage] = useState(1);
//     const [total, setTotal] = useState(0);

//     useEffect(() => {
//         fetchBlogs();
//     }, [category, page]);

//     const fetchBlogs = async () => {
//         setLoading(true);
//         try {
//             const { data } = await getBlogs({ category, page, limit: 9 });
//             setBlogs(data.blogs || []);
//             setTotal(data.total || 0);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filtered = search ? blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase())) : blogs;

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />

//             <div className="bg-gradient-to-r from-primary-500 to-blue-600 py-12 px-4 text-white text-center">
//                 <h1 className="text-3xl font-bold mb-2">Health Blogs</h1>
//                 <p className="text-blue-100">Expert health tips and guides from our doctors</p>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 py-10">
//                 <div className="flex flex-col sm:flex-row gap-3 mb-8">
//                     <div className="relative flex-1">
//                         <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//                         <input
//                             type="text"
//                             placeholder="Search blogs..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
//                         />
//                     </div>
//                     <div className="flex gap-2 flex-wrap">
//                         <button
//                             onClick={() => setCategory('')}
//                             className={'px-4 py-2 rounded-xl text-sm font-medium transition ' + (!category ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200')}
//                         >
//                             All
//                         </button>
//                         {BLOG_CATEGORIES.map((c) => (
//                             <button
//                                 key={c.value}
//                                 onClick={() => setCategory(c.value)}
//                                 className={'px-4 py-2 rounded-xl text-sm font-medium transition ' + (category === c.value ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200')}
//                             >
//                                 {c.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {loading ? <Loader /> : filtered.length === 0 ? (
//                     <div className="text-center py-20 text-gray-400">No blogs found</div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filtered.map((blog) => (
//                             <Link key={blog._id} to={'/blogs/' + blog.slug} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden block">
//                                 {blog.thumbnail && (
//                                     <img src={blog.thumbnail} alt={blog.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-300" />
//                                 )}
//                                 <div className="p-5">
//                                     <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full capitalize">{blog.category}</span>
//                                     <h3 className="font-semibold text-gray-800 mt-2 mb-2 line-clamp-2 group-hover:text-primary-500 transition">{blog.title}</h3>
//                                     <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
//                                     <div className="flex items-center gap-2 mt-3">
//                                         <img
//                                             src={blog.author?.avatar || 'https://ui-avatars.com/api/?name=' + blog.author?.name + '&background=0ea5e9&color=fff&size=32'}
//                                             className="w-6 h-6 rounded-full"
//                                             alt={blog.author?.name}
//                                         />
//                                         <span className="text-xs text-gray-400">{blog.author?.name} · {formatDate(blog.createdAt)}</span>
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>
//                 )}
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default Blogs;












import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getBlogs } from '../../services/blogService';
import { formatDate } from '../../utils/formatDate';
import { FiSearch, FiClock, FiEye } from 'react-icons/fi';
import { BLOG_CATEGORIES } from '../../utils/constants';

const readingTime = (content) => {
    if (!content) return 1;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
};

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const LIMIT = 9;

    useEffect(() => {
        fetchBlogs();
    }, [page, category, search]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const params = { page, limit: LIMIT };
            if (category) params.category = category;
            if (search) params.search = search;

            const { data } = await getBlogs(params);
            setBlogs(data.blogs || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleCategory = (cat) => {
        setCategory(cat === category ? '' : cat);
        setPage(1);
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Blogs</h1>
                    <p className="text-gray-500">Tips, guides, and health information from our doctors</p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mt-6 max-w-lg mx-auto flex gap-2">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search blogs..."
                                className="input-field pl-9"
                            />
                        </div>
                        <button type="submit" className="btn-primary px-5">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => handleCategory('')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!category
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400'
                            }`}
                    >
                        All
                    </button>
                    {BLOG_CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategory(cat.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === cat.value
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                {!loading && (
                    <p className="text-sm text-gray-500 mb-6">
                        {total} article{total !== 1 ? 's' : ''} found
                        {search && ` for "${search}"`}
                        {category && ` in ${BLOG_CATEGORIES.find((c) => c.value === category)?.label}`}
                    </p>
                )}

                {/* Blog Grid */}
                {loading ? (
                    <Loader />
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📝</div>
                        <p className="text-gray-500">No blogs found</p>
                        {(search || category) && (
                            <button
                                onClick={() => { setSearch(''); setSearchInput(''); setCategory(''); setPage(1); }}
                                className="mt-4 text-primary-500 hover:underline text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blogs/${blog.slug}`}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group"
                            >
                                {/* Thumbnail */}
                                {blog.thumbnail ? (
                                    <div className="overflow-hidden h-48">
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="w-full h-full group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center text-5xl">
                                        📰
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Category */}
                                    <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full capitalize font-medium">
                                        {blog.category?.replace('-', ' ')}
                                    </span>

                                    {/* Title */}
                                    <h3 className="font-semibold text-gray-800 mt-2 mb-2 line-clamp-2 group-hover:text-primary-500 transition leading-snug">
                                        {blog.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {blog.excerpt && (
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    {/* Meta */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={
                                                    blog.author?.avatar ||
                                                    `https://ui-avatars.com/api/?name=${blog.author?.name}&background=0ea5e9&color=fff&size=32`
                                                }
                                                alt={blog.author?.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span className="text-xs text-gray-500">{blog.author?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <FiClock size={11} /> {readingTime(blog.content)} min
                                            </span>
                                            {blog.views > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <FiEye size={11} /> {blog.views}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 mt-2">{formatDate(blog.createdAt)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-primary-400 transition"
                        >
                            ← Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === p
                                    ? 'bg-primary-500 text-white'
                                    : 'border border-gray-200 hover:border-primary-400'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-primary-400 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Blogs;