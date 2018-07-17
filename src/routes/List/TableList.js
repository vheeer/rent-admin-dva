import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Popover,
  Popconfirm,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class VSelect extends React.Component {
  render() {
    return <Select {...this.props} defaultValue={this.props.value} />;
  }
}
VSelect.Option = Select.Option;
const { Option } = VSelect;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create({
  mapPropsToFields(props) {
    // 填值函数
    const KV = (key, value) => {
      fieldsObj[key] = Form.createFormField({
        value,
      });
    };

    const { editRecord, __that } = props;
    const fieldsObj = {};
    // console.log("editRecord", editRecord);
    const { type } = __that;
    console.log("type is: ", type);
    switch (type)
    {
      case 'add':
        KV('_count', 1);
        break;
      case 'updateOne':
        // 更新一条记录（添值进表单）
        const keys = Object.keys(editRecord);
        keys.forEach(key => {
          KV(key, editRecord[key]);
        });
        break;
      case 'updateMany':
        break;
    }

    return fieldsObj;
  },
  onValuesChange(props, values) {
    console.log(values);
  },
})(props => {
  // console.log("create 2 props", props);
  const { modalVisible, form, handleSubmit, handleModalVisible, editRecord, __that } = props;
  const { type } = __that;

  let modalTitle = '';
  switch (type)
  {
    case 'add':
      modalTitle = '添加记录';
      break;
    case 'updateOne':
      modalTitle = '修改信息';
      break;
    case 'updateMany':
      modalTitle = '修改多条记录';
      break;
  }

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // editRecord = {}; // 清空状态里的临时行
      form.resetFields();
      handleSubmit(fieldsValue);
    });
  };
  return (
    <Modal
      title={modalTitle}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺ID">
        {form.getFieldDecorator('id', {
          rules: [{ required: false }],
        })(<Input disabled placeholder="新建后自动生成" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺编号">
        {form.getFieldDecorator('shop_sn', {
          rules: [{ required: false, message: '请输入编号' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: false, message: '请输入名称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备描述">
        {form.getFieldDecorator('equipment_desc', {
          rules: [{ required: false, message: '请输入描述' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否营业">
        {form.getFieldDecorator('is_open', {
          rules: [{ required: false, message: '请输入内容' }],
        })(
          <VSelect placeholder="请选择" style={{ width: '100%' }}>
            <Option value={0}>未开业</Option>
            <Option value={1}>运营中</Option>
          </VSelect>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所在城市">
        {form.getFieldDecorator('city', {
          rules: [{ required: false, message: '请输入内容' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地理位置">
        {form.getFieldDecorator('position', {
          rules: [{ required: false, message: '请输入内容' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      {
        type === 'add'?
        (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="添加数量">
            {form.getFieldDecorator('_count', {
              rules: [{ required: true, message: '请输入数量' }],
            })(<InputNumber min={1} max={1000} precision={0} />)}
          </FormItem>
        ):null
      }
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pagination: {},
    filtersArg: {},
    editRecord: {},
  };
  parseState() {
    const { filtersArg } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    return filters;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/match',
      payload: { model: 'shop' },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.state.filtersArg = filtersArg;

    const filters = this.parseState();

    let vsorter = '';
    if (sorter.field) {
      const order = sorter.order.substr(0, sorter.order.length - 3);
      vsorter = `${sorter.field} ${order}`;
    }

    this.setState({ pagination, filtersArg, _sort: vsorter });

    console.log('filters', filters);

    const params = {
      _page: pagination.current, 
      _pageSize: pagination.pageSize,
      _sort: vsorter,
      ...formValues,
      ...filters,
    };
    console.log('params', params);

    dispatch({
      type: 'rule/match',
      payload: { model: 'shop', ...params },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pagination, formValues, _sort } = this.state;

    const filters = this.parseState();

    const params = {
      _page: pagination.current,
      _pageSize: pagination.pageSize,
      _sort,
      ...formValues,
      ...filters,
    };
    console.log('params', params);

    form.resetFields();
    this.setState({
      formValues: {},
    });

    dispatch({
      type: 'rule/match',
      payload: { model: 'shop' },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleModalVisible = flag => {
    if (!flag) this.editRecord = {};
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, state, form } = this.props;
    const { pagination, formValues, _sort } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      const params = {
        _page: pagination.current,
        _pageSize: pagination.pageSize,
        _sort,
        ...formValues,
        ...values,
      };
      console.log("params", params);
      console.log("params.add_time.valueOf()", params.add_time.valueOf());

      dispatch({
        type: 'rule/match',
        payload: { model: 'shop', ...params },
      });
    });
  };

  handleSubmit = fields => {
    const { dispatch, state } = this.props;
    const { pagination, formValues, _sort, selectedRows } = this.state;
    const { type } = this;

    const filters = this.parseState();

    const params = {
      _page: pagination.current,
      _pageSize: pagination.pageSize,
      _sort,
      ...formValues,
      ...filters,
    };
    console.log("params", params);
    let action = '';

    switch (type)
    {
      case 'add':
        action = 'add';
        break;
      case 'updateOne':
        action = 'add';
        break;
      case 'updateMany':
        action = 'updatemul';
        let _ids = '';
        selectedRows.forEach(({ id }) => _ids += id + ',');
        _ids = _ids.substr(0, _ids.length - 1);
        fields._ids = _ids;
        break;
      default:
        break;
    }
    dispatch({
      type: 'rule/' + action,
      payload: { model: 'shop', ...fields },
      callback: () => {
        dispatch({
          type: 'rule/match',
          payload: { model: 'shop', ...params },
        });
      },
    });
    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleDelete = (e, record) => {
    const { dispatch } = this.props;
    const { pagination, formValues, _sort } = this.state;

    const filters = this.parseState();

    const params = {
      _page: pagination.current,
      _pageSize: pagination.pageSize,
      _sort,
      ...formValues,
      ...filters,
    };
    console.log('params', params);

    const { id } = record;
    dispatch({
      type: 'rule/drop',
      payload: { model: 'shop', id },
      callback: () => {
        dispatch({
          type: 'rule/match',
          payload: { model: 'shop', ...params },
        });
      },
    });
  };

  handleEdit = (e, record) => {
    this.type = 'updateOne';
    this.editRecord = record;
    this.handleModalVisible(true);
  };

  handleAddClick = e => {
    this.type = 'add';
    this.handleModalVisible(true);
  }

  handleUpdateMany = e => {
    this.type = 'updateMany';
    this.handleModalVisible(true);
  }

  handleDeleteMany = e => {
    const { dispatch } = this.props;
    const { selectedRows, pagination, formValues, _sort } = this.state;

    const filters = this.parseState();

    const params = {
      _page: pagination.current,
      _pageSize: pagination.pageSize,
      _sort,
      ...formValues,
      ...filters,
    };
    console.log('params', params);

    let ids = '';
    selectedRows.forEach(({ id }) => ids += id + ',');
    ids = ids.substr(0, ids.length - 1);

    console.log("ids: ", ids);
    const content = '您将要删除' + selectedRows.length + '个项，删除后不可恢复！';
    confirm({
      title: '提示',
      content,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'rule/drop',
          payload: { model: 'shop', ids },
          callback: () => {
            dispatch({
              type: 'rule/match',
              payload: { model: 'shop', ...params },
            });
          },
        });
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  handleDateChange = (a,b,c) => {
    console.log(a,b,c);
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="店铺编号">
              {getFieldDecorator('shop_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否营业">
              {getFieldDecorator('is_open')(
                <VSelect placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0}>未开业</Option>
                  <Option value={1}>运营中</Option>
                </VSelect>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="店铺编号">
              {getFieldDecorator('shop_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否营业">
              {getFieldDecorator('is_open')(
                <VSelect placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0}>未开业</Option>
                  <Option value={1}>运营中</Option>
                </VSelect>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="店铺名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备描述">
              {getFieldDecorator('equipment_desc')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所在城市">
              {getFieldDecorator('city')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="添加日期">
              {getFieldDecorator('add_time')(
                <DatePicker onChange={this.handleDateChange} style={{ width: '100%' }} placeholder="请输入添加日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const _that = this;
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '店铺编号',
        dataIndex: 'shop_sn',
      },
      {
        title: '店铺名称',
        dataIndex: 'name',
      },
      {
        title: '设备描述',
        dataIndex: 'equipment_desc',
      },
      {
        title: '是否营业',
        dataIndex: 'is_open',
        filters: [
          {
            text: '未开业',
            value: 0,
          },
          {
            text: '营业中',
            value: 1,
          },
        ],
        filterMultiple: false,
        
      },
      {
        title: '所在城市',
        dataIndex: 'city',
      },
      {
        title: '地理位置',
        dataIndex: 'position',
        width: 100,
        sort: true,
        render: (val, record) => {
          const length = val.length;
          const breif = val.substr(0, 6);
          const title = (
            <Fragment>
              <b>{record.name}</b>的地理位置
            </Fragment>
          );
          return (
            <Popover content={val} title={title} trigger="hover">
              {breif}
              {length > 6 ? '...' : null}
            </Popover>
          );
        },
      },
      {
        title: '添加时间',
        dataIndex: 'add_time',
        sorter: true,
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a href="javascript:(0)" onClick={(record => e => _that.handleEdit(e, record))(record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="删除后不可恢复！"
              okText="删除"
              cancelText="取消"
              onConfirm={(record => e => _that.handleDelete(e, record))(record)}
            >
              <a href="javascript:(0)">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
      editRecord: this.editRecord,
      __that: this
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAddClick}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleUpdateMany}>批量修改</Button>
                  <Button type="danger" onClick={this.handleDeleteMany}>批量删除</Button>

                  {/*
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  */}
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
