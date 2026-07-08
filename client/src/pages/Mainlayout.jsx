import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const Mainlayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname === '/' ? 'teachers' : location.pathname.replace('/', '');

    const menuItems = [
        {
            key: 'teachers',
            icon: <UserOutlined style={{ fontSize: '16px' }} />,
            label: 'Danh sách Giáo viên',
        },
        {
            key: 'list-teacher-position',
            icon: <BankOutlined style={{ fontSize: '16px' }} />,
            label: 'Vị trí công tác',
        },
    ];

    const handleMenuClick = (e) => {
        if (e.key === 'teachers') {
            navigate('/');
        } else {
            navigate(`/${e.key}`);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
            <aside
                className={`bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col h-full sticky top-0 left-0 transition-all duration-300 ease-in-out z-20 shrink-0 border-r border-slate-800/40 shadow-xl shadow-slate-950/20
      ${collapsed ? 'w-20' : 'w-64'}`}
            >
                <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'justify-start px-6'} border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-sm transition-all duration-200`}>
                    <div className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-linear-to-tr from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10 border border-cyan-400/20 shrink-0">
                            <TeamOutlined className="text-lg text-white" />
                        </div>

                        {!collapsed && (
                            <div className="flex flex-col justify-center animate-in fade-in slide-in-from-left-2 duration-300">
                                <h1 className="m-0 bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent font-extrabold text-sm tracking-wider uppercase whitespace-nowrap">
                                    Quản lý Giáo viên
                                </h1>
                                <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
                                    Admin Dashboard
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-3 py-4 flex-1 overflow-y-auto custom-scrollbar">
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[currentPath]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        className="bg-transparent border-none [&_.ant-menu-item]:rounded-xl! [&_.ant-menu-item]:mb-1.5 [&_.ant-menu-item]:h-11 [&_.ant-menu-item-selected]:bg-linear-to-r! [&_.ant-menu-item-selected]:from-cyan-500 [&_.ant-menu-item-selected]:to-blue-500 [&_.ant-menu-item-selected]:text-white! [&_.ant-menu-item:hover]:text-slate-200!"
                        style={{ background: 'transparent' }}
                    />
                </div>
            </aside>

            <div className="flex-1 min-w-0 bg-slate-50/50 flex flex-col h-full overflow-hidden">
                <header className="bg-white px-8 flex items-center border-b border-slate-100 w-full h-16 sticky top-0 z-10 shadow-sm shadow-slate-100/40">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-slate-800 font-bold text-lg tracking-tight">
                            {currentPath === 'teachers' ? 'Danh sách Giáo viên' : 'Vị trí công tác'}
                        </div>
                        <div className="text-slate-400 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            Hệ thống quản lý thông tin giáo viên
                        </div>
                    </div>
                </header>

                <main className="p-6 w-full flex-1 min-w-0 flex flex-col overflow-y-auto">
                    <div className="w-full flex-1 min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Mainlayout;