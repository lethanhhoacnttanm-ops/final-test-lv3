import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Form,
  Input,
  Select,
  message,
  Card,
  Typography,
  Tooltip,
  Spin,
  Drawer,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BookOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [user, setUser] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [globalActiveCount, setGlobalActiveCount] = useState(0);
  const [globalInactiveCount, setGlobalInactiveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4, 
    total: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchTeachersData = useCallback(async (pageNumber = 1, pageSize = 4) => {
    setLoading(true);
    try {
      const [resTeacher, resPositionTeacher, resUser] = await Promise.all([
        axios.get(`http://localhost:8080/teachers?page=${pageNumber}&limit=${pageSize}`),
        axios.get("http://localhost:8080/teacher-positions"),
        axios.get("http://localhost:8080/users")
      ]);

      const responseTeacher = resTeacher.data?.data || [];
      const breakpage = resTeacher.data?.pagination;
      const allOnduty = resTeacher.data?.activeCount || 0;
      const offDuty = resTeacher.data?.inactiveCount || 0;
      const responsePosition = resPositionTeacher.data?.data || [];
      const responseUser = resUser.data?.data || [];

      setTeachers(responseTeacher);
      setDataSource(responseTeacher);
      setPositions(responsePosition);
      setUser(responseUser);
      setGlobalActiveCount(allOnduty);
      setGlobalInactiveCount(offDuty);

      setPagination({
        current: breakpage?.currentPage || pageNumber,
        pageSize: pageSize,
        total: breakpage?.totalItems || 0,
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      message.error('Không thể tải danh sách dữ liệu từ server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachersData(pagination.current, pagination.pageSize);
  }, [fetchTeachersData]);

  const handleTableChange = (newPagination) => {
    fetchTeachersData(newPagination.current, newPagination.pageSize);
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    
    const dataPost = {
      code: `GV${Math.floor(1000 + Math.random() * 9000)}`, 
      userDetail: {
        name: values.name,
        email: values.email,
        address: values.address || '',
      },
      phone: values.phone || '',
      isActive: values.status === 'active' ? true : false,
      teacherPositions: values.position_id ? [values.position_id] : [],
      degrees: [
        {
          type: values.education_level || '',
          major: values.education_school || '',
          isGraduated: true 
        }
      ]
    };

    try {
      await axios.post("http://localhost:8080/teachers", dataPost);
      message.success('Thêm giáo viên thành công');
      setModalOpen(false);
      form.resetFields();
      fetchTeachersData(1, pagination.pageSize);
    } catch (error) {
      console.error("Lỗi từ server:", error.response?.data || error.message);
      message.error('Không thể tạo giáo viên mới');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code) => (
        <Tag color="blue" className="font-mono">
          {code || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Họ và tên',
      key: 'name',
      width: 180,
      render: (_, record) => (
        <Space>
          <UserOutlined className="text-gray-400" />
          <Text strong>{record.userDetail?.name || 'Chưa cập nhật'}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      key: 'email',
      width: 200,
      render: (_, record) => {
        const email = record.userDetail?.email || record.email;
        return email ? (
          <Space>
            <MailOutlined className="text-gray-400" />
            <Text copyable={{ text: email }}>{email}</Text>
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone) =>
        phone ? (
          <Space>
            <PhoneOutlined className="text-gray-400" />
            <Text>{phone}</Text>
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'status',
      width: 150,
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đang công tác
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Ngừng công tác
          </Tag>
        ),
    },
    {
      title: 'Vị trí công tác',
      key: 'position',
      width: 160,
      render: (_, record) => {
        const currentPosId = record.teacherPositions?.[0];
        const currentPos = positions.find(item => item._id === currentPosId);
        return currentPos ? (
          <Tag color="purple">{currentPos.name}</Tag>
        ) : (
          <Text type="secondary">Chưa có chức vụ</Text>
        );
      },
    },
    {
      title: 'Trình độ',
      key: 'education',
      width: 220,
      render: (_, record) => {
        const degree = record.degrees?.[0];
        if (!degree || (!degree.type && !degree.major)) {
          return <Text type="secondary">N/A</Text>;
        }
        return (
          <Tooltip title={degree.major ? `Trường: ${degree.major}` : null}>
            <Space orientation="vertical" size={0}>
              {degree.type && (
                <Text>
                  <BookOutlined className="mr-1" />
                  Bậc: {degree.type}
                </Text>
              )}
              {degree.major && (
                <Text type="secondary" size="small">
                  <BankOutlined className="mr-1" />
                  Ngành: {degree.major}
                </Text>
              )}
            </Space>
          </Tooltip>
        );
      },
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        const address = record.userDetail?.address;
        return address ? (
          <Tooltip title={address}>
            <Space>
              <HomeOutlined className="text-gray-400" />
              <Text ellipsis>{address}</Text>
            </Space>
          </Tooltip>
        ) : (
          <Text type="secondary">Chưa cập nhật</Text>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <div className="mb-6">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className="m-0">
                <UserOutlined className="mr-2" />
                Danh sách Giáo viên
              </Title>
              <Text type="secondary">
                Tổng số user: {user.length} | Hoạt động: {globalActiveCount} | Ngừng hoạt động: {globalInactiveCount}
              </Text>
            </Col>
            <Col>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={() => fetchTeachersData(pagination.current, pagination.pageSize)}>
                  Làm mới
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                  Thêm giáo viên
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="_id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['4', '10', '20', '50'], 
              showTotal: (total) => `Tổng ${total} giáo viên`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1400 }}
            className="bg-white"
          />
        </Spin>
      </Card>

      <Drawer
        title="Thêm giáo viên mới"
        placement="right"
        size={500}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} requiredMark="optional">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select size="large">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item name="position_id" label="Vị trí công tác">
            <Select size="large" placeholder="Chọn vị trí công tác" allowClear>
              {positions.map((pos) => (
                <Option key={pos._id} value={pos._id}>
                  {pos.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="education_level" label="Trình độ (Bậc)">
                <Input placeholder="VD: Thạc sĩ, Tiến sĩ" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="education_school" label="Chuyên Ngành">
                <Input placeholder="Tên chuyên ngành học" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Tạo giáo viên
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}