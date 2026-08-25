import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import NotFoundPage from '@/pages/NotFoundPage';
import Dashboardlayout from '@/layout/Dashboardlayout';
import AssetListPage from '@/pages/AssetListPage';
import EmployeeListPage from '@/pages/EmployeeListPage';
import AllocationsPage from '@/pages/AllocationsPage';
import HistoryPage from '@/pages/HistoryPage';
import LoginPage from '@/pages/auth/LoginPage';

function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Dashboardlayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/assets" element={<AssetListPage />} />
                    <Route path="/employees" element={<EmployeeListPage />} />
                    <Route path='/allocations' element={<AllocationsPage />} />
                    <Route path='/history' element={<HistoryPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route path="/login" element={<LoginPage />} />

            </Routes>
        </>
    );
}

export default AppRoutes;