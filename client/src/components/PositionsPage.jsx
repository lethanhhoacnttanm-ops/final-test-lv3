import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Card,
  Typography,
  Tooltip,
  Spin,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  BankOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

export default function PositionsPage() {
  // Logic cũ của Listteacherposition.jsx đưa vào state mới
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Logic cũ: Gọi API lấy danh sách vị trí công tác bằng Axios
  const fetchPositions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/teacher-positions");
      const result = response.data?.data || [];
      
      setPositions(result);
    } catch (error) {
      console.error("Error from server:", error);
      message.error('Không thể tải danh sách vị trí công tác từ server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Logic cũ của NewPosition.jsx đưa vào xử lý Form khi submit tạo mới
  const handleCreate = async (values) => {
    setSubmitting(true);
    
    // Khớp cấu trúc dữ liệu chuẩn theo logic cũ và backend yêu cầu
    const dataPost = {
      code: values.code,
      name: values.name,
      description: values.description || '',
      active: true // Mặc định trạng thái kích hoạt giống hàm btnActive cũ
    };

    try {
      await axios.post("http://localhost:8080/teacher-positions", dataPost);
      message.success('Tạo vị trí công tác thành công');
      setModalOpen(false);
      form.resetFields();
      fetchPositions(); // Tải lại danh sách sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi từ server:", error.response?.data || error.message);
      message.error('Không thể tạo vị trí công tác mới');
    } finally {
      setSubmitting(false);
    }
  };

  // Định nghĩa các cột hiển thị trong Table (Đổi rowKey thành _id của MongoDB từ API cũ)
  const columns = [
    {
      title: 'Mã vị trí',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code) => (
        <Tag color="purple" className="font-mono">
          {code || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Tên vị trí công tác',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name) => (
        <Space>
          <ApartmentOutlined className="text-gray-400" />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description) =>
        description ? (
          <Tooltip title={description}>
            <Paragraph ellipsis={{ rows: 2 }} className="m-0">
              {description}
            </Paragraph>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: 150,
      render: (active) => (
        <Tag color={active !== false ? "success" : "error"}>
          {active !== false ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Tag>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <div className="mb-6">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className="m-0">
                <BankOutlined className="mr-2" />
                Danh sách Vị trí công tác
              </Title>
              <Text type="secondary">Quản lý các vị trí công tác trong hệ thống</Text>
            </Col>
            <Col>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchPositions}>
                  Làm mới
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                  Thêm vị trí
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={positions}
            rowKey="_id" // Đổi từ id sang _id cho khớp MongoDB API của bạn
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} vị trí`,
            }}
            scroll={{ x: 900 }}
            className="bg-white"
          />
        </Spin>
      </Card>

      <Modal
        title={
          <Space>
            <BankOutlined />
            <span>Thêm vị trí công tác mới</span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item
            name="code"
            label="Mã vị trí"
            rules={[
              { required: true, message: 'Vui lòng nhập mã vị trí' },
              { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã chỉ được chứa chữ, số, gạch dưới và gạch ngang' },
            ]}
          >
            <Input placeholder="VD: GVBM, GVCN, TP_KHOA..." size="large" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên vị trí"
            rules={[{ required: true, message: 'Vui lòng nhập tên vị trí' }]}
          >
            <Input placeholder="Nhập tên vị trí công tác" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết về vị trí công tác" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Tạo vị trí
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}