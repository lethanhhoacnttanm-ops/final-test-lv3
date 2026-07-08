import { useState, useEffect, useCallback } from 'react';
import {
  Avatar,
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
  DeleteOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  EditOutlined,
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

const { Title, Text, Paragraph } = Typography;
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

  const getDegreeConfig = (degreeType) => {
    const type = degreeType?.toLowerCase() || '';

    if (type.includes('cử nhân') || type.includes('bachelor')) {
      return { color: 'cyan', text: 'Cử nhân' };
    }
    if (type.includes('thạc sĩ') || type.includes('master')) {
      return { color: 'blue', text: 'Thạc sĩ' };
    }
    if (type.includes('tiến sĩ') || type.includes('giáo sư') || type.includes('doctor') || type.includes('prof')) {
      return { color: 'purple', text: 'Tiến sĩ / Giáo sư' };
    }

    return { color: 'default', text: degreeType || 'Chưa cập nhật' };
  };

  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code) => (
        <Tag color="purple" className="font-mono font-medium">
          {code || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacherInfo',
      key: 'teacherInfo',
      width: 280,
      render: (_, record) => {
        const user = record.userDetail
        return (
          <Space align="start" size="middle">
            <Avatar
              src={record.avatar}
              icon={<UserOutlined />}
              size={48}
              className="shadow-sm"
            />
            <Space orientation="vertical" size={2} className="w-full">
              <Text strong className="text-base block">{user.name || 'Chưa cập nhật'}</Text>
              <Text type="secondary" size="small" className="block text-xs">
                <MailOutlined className="mr-1" /> {user.email || '-'}
              </Text>
              <Text type="secondary" size="small" className="block text-xs">
                <IdcardOutlined className="mr-1" /> {user.identity || '-'}
              </Text>
            </Space>
          </Space>
        )
      }
    },
    {
      title: 'Trình độ (Cao nhất)',
      dataIndex: 'qualification',
      key: 'qualification',
      width: 200,
      render: (_, record) => {

        const degree = record.degrees?.[0]

        const degreeConfig = getDegreeConfig(degree.type.toLowerCase());

        return (
          <Space orientation="vertical" size={2}>
            <Tag color={degreeConfig.color} className="m-0 font-semibold tracking-wide rounded-md px-2 py-0.5 border-opacity-50">
              {degreeConfig.text}
            </Tag>
            <Text type="secondary" size="small" className="italic text-xs block">
              Chuyên ngành: {degree.major || '-'}
            </Text>
          </Space>
        )
      }
    },
    {
      title: 'Bộ môn',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (department) => (
        <Space>
          <ApartmentOutlined className="text-gray-400" />
          <Text>{department || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'TT công tác',
      dataIndex: 'workStatus',
      key: 'workStatus',
      width: 150,
      render: (_, record) => {

        const congtac = positions.filter((item) => item._id === record.teacherPositions?.[0])
        return (
          <Text>{congtac?.[0]?.name || '-'}</Text>
        )
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (_, record) => {
        const user = record.userDetail
        return (
          (
            <Tooltip title={user.email}>
              <Paragraph ellipsis={{ rows: 2 }} className="m-0 text-sm">
                {user.email}
              </Paragraph>
            </Tooltip>
          )
        )
      }

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
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <a onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-800">
              <EditOutlined className="text-lg" />
            </a>
          </Tooltip>
          <Tooltip title="Xóa">
            <a onClick={() => handleDelete(record)} className="text-red-600 hover:text-red-800">
              <DeleteOutlined className="text-lg" />
            </a>
          </Tooltip>
        </Space>
      ),
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