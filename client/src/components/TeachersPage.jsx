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
  Modal,
  Row,
  Col,
  Upload
} from 'antd';
import {
  PictureOutlined,
  UploadOutlined,
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
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingTeacherId, setEditingTeacherId] = useState(null);

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
    let uploadedImageUrl = previewUrl;

    try {
      if (values.avatar && values.avatar[0]?.originFileObj) {
        const imgFormData = new FormData();
        imgFormData.append('image', values.avatar[0].originFileObj);

        const uploadRes = await axios.post("http://localhost:8080/teachers/upload", imgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrl = uploadRes.data.fileUrl;
      }

      const dataPost = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phone || '',
        address: values.address || '',
        identity: values.identity || '',
        image: uploadedImageUrl,
        dob: values.dob ? values.dob.toISOString() : new Date().toISOString(),
        teacherPositions: values.position_id ? [values.position_id] : [],
        degrees: [
          {
            type: values.education_level || '',
            school: values.education_school || '',
            major: values.education_major || '',
            year: values.education_graduate || '',
            isGraduated: true
          }
        ]
      };

      if (editingTeacherId) {
        await axios.put(`http://localhost:8080/teachers/${editingTeacherId}`, dataPost);
        message.success('Cập nhật thông tin giáo viên thành công');
      } else {
        await axios.post("http://localhost:8080/teachers", dataPost);
        message.success('Thêm giáo viên mới thành công');
      }
      setModalOpen(false);
      form.resetFields();
      setPreviewUrl('');
      fetchTeachersData(pagination.currentPage, pagination.pageSize);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Không thể tạo giáo viên mới');
    } finally {
      setSubmitting(false);
    }
  };

  const showCreateModal = () => {
    setEditingTeacherId(null); 
    form.resetFields();        
    setPreviewUrl('');         
    setModalOpen(true);      
  };

  const handleEdit = (record) => {
    setEditingTeacherId(record._id);

    setModalOpen(true);

    form.setFieldsValue({
      id: record._id,
      name: record.userDetail?.name,
      email: record.userDetail?.email,
      phone: record.userDetail?.phoneNumber,
      address: record.userDetail?.address,
      identity: record.userDetail?.identity,
      status: record.isActive ? 'active' : 'inactive',
      position_id: record.teacherPositions?.[0],
      education_level: record.degrees?.[0]?.type,
      education_school: record.degrees?.[0]?.school,
    });

    if (record.image) {
      setPreviewUrl(record.image);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa giáo viên ${record.userDetail?.name || ''} không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/teachers/${record._id}`);

          message.success('Xóa giáo viên thành công');
          fetchTeachersData(pagination.currentPage, pagination.pageSize);
        } catch (error) {
          console.error("Lỗi xóa giáo viên:", error);
          message.error(error.response?.data?.message || 'Không thể xóa giáo viên');
        }
      },
    });
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
              src={record.image}
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
            <Tooltip title={user.address}>
              <Paragraph ellipsis={{ rows: 2 }} className="m-0 text-sm">
                {user.address}
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

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể upload định dạng JPG/PNG/WebP!');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return false;
  };

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
                <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
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

      <Modal
        title={editingTeacherId ? "Chỉnh sửa thông tin Giáo viên" : "Tạo Giáo viên mới"}
        placement="right"
        size={500}
        onClose={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} requiredMark="optional">
          <Form.Item
            name="avatar"
            label="Ảnh đại diện (Avatar)"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện!' }]}
          >
            <Upload
              maxCount={1}
              listType="picture"
              accept="image/*"
              beforeUpload={beforeUpload}
              onRemove={() => setPreviewUrl('')}
            >
              <Button icon={<UploadOutlined />} className="w-full rounded-xl py-4 flex items-center justify-center font-medium border-dashed border-gray-300">
                Select Product File
              </Button>
            </Upload>
          </Form.Item>
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200/60">
            <Avatar
              size={44}
              shape="square"
              src={previewUrl || teachers?.image}
              icon={<PictureOutlined />}
              className="rounded-lg! border border-gray-100 bg-gray-50 shadow-3xs object-cover"
            />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Image Preview</span>
          </div>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="identity"
            label="CCCD"
            rules={[{ required: true, message: 'Vui lòng nhập CCCD' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Nhập CCCD" size="large" />
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
          <Form.Item name="education_level" label="Trình độ (Bậc)">
            <Input placeholder="VD: Thạc sĩ, Tiến sĩ" size="large" />
          </Form.Item>
          <Form.Item name="education_major" label="Chuyên Ngành">
            <Input placeholder="Tên chuyên ngành học" size="large" />
          </Form.Item>
          <Form.Item name="education_school" label="Trường">
            <Input placeholder="VD: Đại học..." size="large" />
          </Form.Item>
          <Form.Item name="education_graduate" label="Tốt nghiệp">
            <Input placeholder="Năm bao nhiêu" size="large" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Tạo giáo viên
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}