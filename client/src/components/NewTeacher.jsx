import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const NewTeacher = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({})
    const [dataPosition, setDataPosition] = useState([])
    const [saveData, setSaveData] = useState([])

    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [isOpenModal, setIsOpenModal] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);


            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    useEffect(() => {
        setLoading(true)
        const fetchposition = async (req, res) => {
            try {
                const response = await axios.get("http://localhost:8080/teacher-positions");

                const result = response.data?.data;

                if (result.length === 0) {
                    console.warm("Error")
                } else {
                    setDataPosition(result)
                }
            }
            catch {
                console.log("Error from server");
                return res.status(500).json({
                  message: error.message
                })
            }
            finally {
                setLoading(false)
            }
        }

        fetchposition()
    }, [])

    const getDataFromInputPosition = (value) => {
        const arr = dataPosition.filter(item => item.name.toLowerCase() === value.toLowerCase());

        return arr[0]?._id
    }

    const handleOpenModal = () => {
        setIsOpenModal(true)
    }

    const handleCloseModal = () => {
        setIsOpenModal(false);
    }

    const btnGraduated = (value) => {
        setData({
            ...data, degrees: [{
                ...data.degrees?.[0],
                isGraduated: value
            }]
        })
    }

    const btnNotGraduated = (value) => {
        setData({
            ...data, degrees: [{
                ...data.degrees?.[0],
                isGraduated: value
            }]
        })
    }

    const handlePushNewTeach = async () => {
        console.log("Dữ liệu chuẩn bị gửi:", data);
        try {
            await axios.post("http://localhost:8080/teachers", data);
            console.log(data)
            alert("Thêm thành công");
            navigate("/");
        } catch (error) {
            console.log("Lỗi từ server:", error.response?.data || error.message);;
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px', maxWidth: "1000px", margin: '20px 200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', alignItems: 'center' }}>
                <span>❌</span>
                <p>Tạo thông tin giáo viên</p>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: '100px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        />
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <hr style={{ flex: '1', borderTop: '1px solid #dba3f5' }} />
                        <p style={{ fontWeight: 'bold' }}>Thông tin cá nhân</p>
                        <hr style={{ flex: '5', borderTop: '1px solid #dba3f5' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '40px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="required">Họ và tên</label>
                                <input onChange={(e) => { setData({ ...data, name: e.target.value }) }} type="text" placeholder="VD Nguyen Van A" style={{ padding: "5px", borderRadius: '5px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="required">Số điện thoại</label>
                                <input onChange={(e) => { setData({ ...data, phoneNumber: e.target.value }) }} type="text" placeholder="Nhap so dien thoai" style={{ padding: "5px", borderRadius: '5px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="required">So CCCD</label>
                                <input onChange={(e) => { setData({ ...data, identity: e.target.value }) }} type="text" placeholder="Nhap so CCCD" style={{ padding: "5px", borderRadius: '5px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="required">Ngay sinh</label>
                                <input onChange={(e) => { setData({ ...data, dob: e.target.value }) }} type="date" placeholder="Chon ngay sinh" style={{ padding: "5px", borderRadius: '5px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="required">Email</label>
                                <input onChange={(e) => { setData({ ...data, email: e.target.value }) }} type="email" placeholder="nguyenvana@gmail.com" style={{ padding: "5px", borderRadius: '5px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label className="required">Dia chi</label>
                                <input onChange={(e) => { setData({ ...data, address: e.target.value }) }} type="text" placeholder="Dia chi thuong tru" style={{ padding: "5px", borderRadius: '5px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <hr style={{ flex: '1', borderTop: '1px solid #dba3f5' }} />
                    <p style={{ fontWeight: 'bold' }}>Thông tin công tác</p>
                    <hr style={{ flex: '6', borderTop: '1px solid #dba3f5' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <label required>Vị trí công tác</label>
                    <input onChange={(e) => setData({ ...data, teacherPositions: getDataFromInputPosition(e.target.value) })} type="text" placeholder="Nhap vi tri cong tac" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }} />
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <hr style={{ flex: '1', borderTop: '1px solid #dba3f5' }} />
                    <p style={{ fontWeight: 'bold' }}>Hoc vi</p>
                    <hr style={{ flex: '6', borderTop: '1px solid #dba3f5' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <button onClick={() => { handleOpenModal() }} style={{ color: '#090808', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm học vị</button>
                </div>

                <div >
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead style={{ backgroundColor: '#d0afe7a6', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '12px', width: '10%' }}>Bậc</th>
                                <th style={{ padding: '12px', width: '20%' }}>Trường</th>
                                <th style={{ padding: '12px', width: '25%' }}>Chuyên ngành</th>
                                <th style={{ padding: '12px', width: '20%' }}>Trạng thái</th>
                                <th style={{ padding: '12px', width: '25%' }}>Tốt nghiệp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saveData.map((item, index) => {
                                return (

                                    <tr key={index + 1}>
                                        <td style={{ padding: '12px', width: '10%' }}>{item.degrees?.[0]?.type}</td>
                                        <td style={{ padding: '12px', width: '20%' }}>{item.degrees?.[0]?.school}</td>
                                        <td style={{ padding: '12px', width: '25%' }}>{item.degrees?.[0]?.major}</td>
                                        <td style={{ padding: '12px', width: '25%' }}>
                                            <div style={{ backgroundColor: item.degrees?.[0]?.isGraduated ? 'green' : 'red', color: '#fff', padding: '5px', borderRadius: '6px' }}>
                                                {item.degrees?.[0]?.isGraduated ? 'Đang hoạt động' : 'Không hoạt động'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', width: '20%' }}>{item.degrees?.[0]?.year}</td>
                                    </tr>
                                )

                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <button onClick={() => setSaveData([data])} style={{ color: '#090808', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
                </div>

                {isOpenModal && (
                    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px', maxWidth: "1000px", margin: '20px 200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button onClick={handleCloseModal} style={{ background: "none", cursor: "pointer", padding: '0 20px', borderRadius: "50%", border: "none" }}>❌</button>
                            <h2>Điền thông tin học vị </h2>
                        </div>

                        <div style={{ padding: "0 20px" }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="required">Bậc</label>
                                    <input onChange={(e) => setData({ ...data, degrees: [{ ...data.degrees?.[0], type: e.target.value }] })} type="text" placeholder="VD Nguyen Van A" style={{ padding: "5px", borderRadius: '5px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="required">Trường</label>
                                    <input onChange={(e) => setData({ ...data, degrees: [{ ...data.degrees?.[0], school: e.target.value }] })} type="text" placeholder="Nhap so dien thoai" style={{ padding: "5px", borderRadius: '5px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="required">Chuyên Ngành</label>
                                    <textarea onChange={(e) => setData({ ...data, degrees: [{ ...data.degrees?.[0], major: e.target.value }] })} style={{ padding: "5px", borderRadius: '5px' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="required">Trạng thái</label>
                                    <div style={{ display: 'flex', justifyContent: 'left' }}>
                                        <button onClick={() => btnGraduated(true)} className={`status-btn-teacher ${data.degrees?.[0]?.isGraduated ? 'active' : 'default'}`}>Hoạt động {console.log(data)}</button>
                                        <button onClick={() => btnNotGraduated(false)} className={`status-btn-teacher ${!data.degrees?.[0]?.isGraduated ? 'active' : 'default'}`}>Ngừng {console.log(data)}</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="required">Tốt nghiệp</label>
                                    <input onChange={(e) => setData({ ...data, degrees: [{ ...data.degrees?.[0], year: Number(e.target.value) }] })} style={{ padding: "5px", borderRadius: '5px' }}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handlePushNewTeach}
                style={{ color: '#fff', backgroundColor: '#a370f7', padding: '10px 25px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Lưu thông tin
            </button>
        </div>
    );
}

export default NewTeacher;