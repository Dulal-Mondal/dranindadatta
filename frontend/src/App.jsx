// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { Toaster } from 'react-hot-toast';
// import { store } from './redux/store';
// import { AuthProvider } from './context/AuthContext';
// import { SocketProvider } from './context/SocketContext';
// import AppRoutes from './routes/AppRoutes';

// function App() {
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <AuthProvider>
//           <SocketProvider>
//             <AppRoutes />
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 3000,
//                 style: { fontSize: '14px' },
//               }}
//             />
//           </SocketProvider>
//         </AuthProvider>
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;


import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';
import FloatingChat from './components/chat/FloatingChat';
import { useAuth } from './context/AuthContext';
import { initPixel, trackPageView as pixelPageView } from './utils/pixel';
import { initGA, trackPageView as gaPageView } from './utils/analytics';
import api from './services/api';

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // ✅ App load হলে DB থেকে Pixel + GA init করো
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/settings/public');
        if (data.settings.facebook_pixel_id) initPixel(data.settings.facebook_pixel_id);
        if (data.settings.ga_measurement_id) initGA(data.settings.ga_measurement_id);
      } catch (err) {
        console.error('[Settings]', err.message);
      }
    };
    loadSettings();
  }, []);

  // ✅ প্রতিটা page change এ track করো
  useEffect(() => {
    pixelPageView();
    gaPageView(location.pathname);
  }, [location]);

  return (
    <>
      <AppRoutes />
      {user && <FloatingChat />}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000, style: { fontSize: '14px' } }}
      />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;