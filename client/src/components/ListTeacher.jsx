import { useEffect, useState, useMemo } from 'react';
import { Link, Outlet } from 'react-router-dom'
import NewTeacher from './NewTeacher.jsx';
import { Loading3QuartersOutlined, SearchOutlined, UserAddOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import axios from 'axios';

const ListTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [position, setPosition] = useState([]);
    const [user, setUser] = useState([]);
    const [dataSource, setDataSource] = useState([])
    const [globalActiveCount, setGlobalActiveCount] = useState(0);
    const [globalInactiveCount, setGlobalInactiveCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(4);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [userDetails, setUserDetails] = useState({});

    const fetchTeachers = async (pageNumber = 1) => {
        setLoading(true);
        try {

            const [resTeacher, resPositionTeacher, resUser] = await Promise.all([
                axios.get(`http://localhost:8080/teachers?page=${pageNumber}&limit=${pageSize}`),
                axios.get("http://localhost:8080/teacher-positions"),
                axios.get("http://localhost:8080/users")
            ])
            const responseTeacher = resTeacher.data?.data;

            const breakpage = resTeacher.data?.pagination;

            const allOnduty = resTeacher.data?.activeCount;

            const offDuty = resTeacher.data?.inactiveCount;

            const responsePosition = resPositionTeacher.data?.data

            const responseUser = resUser.data?.data

            setTeachers(responseTeacher);
            setPosition(responsePosition)
            setUser(responseUser)
            setDataSource(responseTeacher)
            setGlobalActiveCount(allOnduty);
            setGlobalInactiveCount(offDuty);
            setUserDetails(responseTeacher.reduce((acc, teacher) => {
                if (teacher.userDetail) {
                    acc[teacher._id] = teacher.userDetail;
                }
                return acc;
            }, {}));

            setTotalItems(breakpage?.totalItems || 0);
            setTotalPages(breakpage?.totalPages || 1);
            setPage(breakpage?.currentPage || pageNumber);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {

        fetchTeachers(page)

    }, [])


    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        fetchTeachers(newPage);
    };

    if (loading) {
        return <div className="empty-state">Đang tải dữ liệu...</div>;
    }

    const handleSearch = (e) => {
        const value = e.target.value;

        const keyword = value.toLowerCase();

        if (!keyword) {
            setDataSource(teachers);
            return;
        }

        const filteredData = teachers.filter((item) => {
            const Detail = item.userDetail
            return (
                Detail.name.includes(keyword) ||
                Detail.email.includes(keyword)
            );
        });

        setDataSource(filteredData)
    }

    const totalTeacher = user.length

    return (
        <section stysle={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Input onChange={handleSearch} style={{ width: "20%" }} placeholder='Tìm kiếm thông tin' prefix={<SearchOutlined />} />
                <Link to="/ListTeacherPosition"><button style={{ color: '#090808', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Vị trí công tác</button></Link>
                <Link to="/"><button style={{ color: '#090808', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}><Loading3QuartersOutlined /> Tao moi</button></Link>
                <Link to="/createteacher"><button style={{ color: '#090808', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}><UserAddOutlined /> Them</button></Link>
            </div>

            <div style={{ padding: '10px', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead style={{ backgroundColor: '#e0d1f1', color: '#101827', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '12px' }}>Mã</th>
                            <th style={{ padding: '12px' }}>Giảng viên</th>
                            <th style={{ padding: '12px' }}>Trình độ học vấn</th>
                            <th style={{ padding: '12px' }}>Bộ môn</th>
                            <th style={{ padding: '12px' }}>VT Công tác</th>
                            <th style={{ padding: '12px' }}>Địa chỉ</th>
                            <th style={{ padding: '12px' }}>Trạng thái</th>
                            <th style={{ padding: '12px' }}>Hành động</th>
                        </tr>
                    </thead>
                    {dataSource.length === 0 ? (
                        <tbody>
                             <tr>
                                <td>
                                    <div className="empty-state" style={{padding: "50px", textAlign: "center"}}><span>Không hề tìm thấy !!!</span></div>
                                </td>
                             </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {dataSource.map((teacher, index) => {
                                const Detail = teacher.userDetail;
                                {console.log(Detail)}
                                const Position = position.find(item => item._id === teacher.teacherPositions?.[0])?.name || "Chưa có chức vụ"; return (
                                    <tr key={teacher._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '12px', width: '6.25%' }}>{teacher.code}</td>
                                        <td style={{ padding: '12px', width: '18.75%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                                                    <img
                                                        src={"./pic/pic-boy.jpg"}
                                                        alt={Detail.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <strong>{teacher.userDetail?.name}</strong>
                                                    <div style={{ color: '#6c757d', fontSize: '14px' }}>{Detail.email || teacher.email}</div>
                                                    {user.map(item => { if (item._id === teacher.userId) return (<div key={item._id} style={{ color: '#6c757d', fontSize: '14px' }}>{item.identity}</div>) })}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', width: '12%' }}>
                                            {teacher.degrees?.map((degree, index) => (
                                                <div key={index} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    <p>Bậc: {degree.type}</p>
                                                    <p>Chuyên Ngành: {degree.major}</p>
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '12px', width: '12%', fontStyle: 'italic', color: "gray" }}>N/A</td>
                                        <td style={{ padding: '12px', width: '12.5%' }}>
                                            <p style={{ margin: 0 }}>{Position}</p>
                                        </td>
                                        <td style={{ padding: '12px', width: '12.5%' }}>
                                            <p style={{ margin: 0 }}>{userDetails[teacher._id]?.address || 'Chưa cập nhật'}</p>
                                        </td>
                                        <td style={{ padding: '12px', width: '12.5%' }}>
                                            <span style={{ backgroundColor: teacher.isActive ? '#0dac33' : '#f8f9fa', color: teacher.isActive ? '#eef4ef' : '#6c757d', padding: '5px 10px', borderRadius: '4px' }}>
                                                {teacher.isActive ? 'Đang công tác' : 'Ngừng công tác'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', width: '20%' }}>
                                            <button style={{ color: '#000000', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🕸️ Xem chi tiết</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <div>Tổng : {totalTeacher}</div>
                    <button style={{ outline: "none", background: "none", border: "none"}} onClick={() => handlePageChange(page - 1)} disabled={page <= 1} >
                        <LeftOutlined style={{color:"gray"}}/>
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        return (
                            <button
                                key={pageNumber}
                                style={{
                                    backgroundColor: pageNumber === page ? '#007bff' : '#f8f9fa',
                                    color: pageNumber === page ? '#fff' : '#495057',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '5px'
                                }}
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button style={{ outline: "none", background: "none", border: "none"}} onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                        <RightOutlined style={{color:"gray"}} />
                    </button>
                </div>
            )}

            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </div>
        </section>
    );
}

export default ListTeacher;