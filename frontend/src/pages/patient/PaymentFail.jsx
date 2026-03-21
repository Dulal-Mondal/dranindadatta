import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const PaymentFail = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center py-20 px-4">
                <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                    <p className="text-gray-500 mb-8">
                        Your payment was not completed. Please try again.
                    </p>
                    <div className="space-y-3">
                        <Link
                            to="/doctors"
                            className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition"
                        >
                            Try Again
                        </Link>
                        <Link
                            to="/"
                            className="block w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;