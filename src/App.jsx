import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import Homepage from './pages/Homepage';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import Form from './components/Form';
import CityList from './components/CityList';
import CountryList from './components/CountryLIst';
import City from './components/City';
import ProtectedRoute from './pages/ProtectedRoute';
import { CitiesProvider } from './components/contexts/CitiesContext';
import { AuthProvider } from './components/contexts/AuthContext';

function App() {
  return (
    <>
      <CitiesProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path='/product' element={<Product />} />
              <Route path='/pricing' element={<Pricing />} />
              <Route path='/login' element={<Login />} />
              <Route
                path='/app'
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to='cities' />} />
                <Route path='cities' element={<CityList />} />
                <Route path='cities/:id' element={<City />} />
                <Route path='countries' element={<CountryList />} />
                <Route path='form' element={<Form />} />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CitiesProvider>
    </>
  );
}

export default App;
