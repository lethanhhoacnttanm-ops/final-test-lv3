import { useState, useEffect } from "react";
import axios from "axios";

const NewPosition = () => {
    const [data, setData] = useState({});

    const btnActive = (value) => {
        setData({ ...data, active: value })
    }

    const btnInactive = (value) => {
        setData({ ...data, active: value })
    }

    const handleSubmit = async () => {
        console.log("Dữ liệu chuẩn bị gửi:", data);
        try {
            await axios.post("http://localhost:8080/teacher-positions", data);
            console.log(data)
            alert("Thêm thành công");
        } catch (error) {
            console.log("Lỗi từ server:", error.response?.data || error.message);;
        }
    };




    return (
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px', maxWidth: "1000px", margin: '20px 200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <button style={{ background: "none", cursor: "pointer", padding: '0 20px', borderRadius: "50%", border: "none" }}>❌</button>
                <h2>Vi tri cong tac</h2>
            </div>

            <div style={{ padding: "0 20px" }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className="required">Mã</label>
                        <input onChange={(e) => setData({ ...data, code: e.target.value })} type="text" placeholder="VD Nguyen Van A" style={{ padding: "5px", borderRadius: '5px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className="required">Tên vị trí công tác</label>
                        <input onChange={(e) => setData({ ...data, name: e.target.value })} type="text"  style={{ padding: "5px", borderRadius: '5px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className="required">Mô tả</label>
                        <textarea onChange={(e) => setData({ ...data, des: e.target.value })} style={{ padding: "5px", borderRadius: '5px' }}></textarea>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className="required">Trạng thái</label>
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <button onClick={() => btnActive(true)} className={`status-btn-teacher ${data.active ? 'active' : 'default'}`}>Hoạt động {console.log(data)}</button>
                            <button onClick={() => btnInactive(false)} className={`status-btn-teacher ${!data.active ? 'active' : 'default'}`}>Ngừng {console.log(data)}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "right", padding: "0 20px" }}>
                <button onClick={handleSubmit}>
                    🕸️ Lưu
                </button>
            </div>
        </div>
    )
}

export default NewPosition;