import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import {Loading3QuartersOutlined, PlusOutlined } from "@ant-design/icons"
import axios from "axios";

const ListTeacherPosition = () => {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchdata = async (req, res) => {
            try {

                const response = await axios.get("http://localhost:8080/teacher-positions");

                const result =  response.data?.data;

                if (result.length === 0) {
                    throw new error("Empty result !!!")
                } else {
                    setData(result)
                }

            } catch (error) {
                console.log("Error from server")
                return res.status(500).json({
                    message: error.message
                })
            }
            finally {
                setLoading(false)
            }
        }

        fetchdata();
    }, [])

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div>
                    <Link to="/"><button style={{color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px'}} >Trở về</button></Link>
                </div>
                <Link to="/ListTeacherPosition/createposition"><button style={{ color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}><PlusOutlined/> Tạo mới</button></Link>
                <Link to="/ListTeacherPosition"><button style={{ color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}><Loading3QuartersOutlined/> Làm mới</button></Link>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead style={{ backgroundColor: '#d0afe7a6', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '12px', width: '10%' }}>STT</th>
                            <th style={{ padding: '12px', width: '10%' }}>Mã</th>
                            <th style={{ padding: '12px', width: '20%' }}>Tên vị trí</th>
                            <th style={{ padding: '12px', width: '30%' }}>Trạng thái</th>
                            <th style={{ padding: '12px', width: '30%' }}>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            
                            return (
                                <tr key={item._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '12px', width: '10%',padding: '5px 10px', borderRadius: '4px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px', width: '10%',padding: '5px 10px', borderRadius: '4px' }}>{item.code}</td>
                                    <td style={{ padding: '12px', width: '20%',padding: '5px 10px', borderRadius: '4px' }}>{item.name}</td>
                                    <td style={{ padding: '12px', width: '30%',padding: '5px 10px', borderRadius: '4px' }}><div style={{ backgroundColor: item.isActive ? 'green' : 'red', color: '#fff', padding: '5px', borderRadius:'6px'}}>{item.isActive ? 'Hoạt động' : 'Không hoạt động'}</div></td>
                                    <td style={{ padding: '12px', width: '30%',padding: '5px 10px', borderRadius: '4px' }}>{item.des}</td>
                                </tr> 
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default ListTeacherPosition;
