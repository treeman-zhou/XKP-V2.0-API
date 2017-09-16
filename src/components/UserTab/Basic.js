// @flow
import React from 'react'
import styles from './Basic.css'
import { Table, Icon, Form, Input, Button, Select, Modal, Row, Col, message } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
import universalFetch, { handleFetchError } from 'utils/fetch'

type Props = {
  data: Object
}
type States = {
  dataSource: Array<Object>,
  cxpd: string,
  dy: string,
  wt: string,
  xsky: string,
  post: string,
  xskybz: string,
  postbz: string,
  visible: boolean,
  modalData: Object
}
class Basic extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      dataSource: [],
      cxpd: '',
      dy: '',
      wt: '',
      xsky: '',
      post: '',
      modalData: {},
      visible: false,
      xskybz: '',
      postbz: ''
    }
    this.getData = this.getData.bind(this)
    this.updateScore = this.updateScore.bind(this)
    this.changeInput = this.changeInput.bind(this)
    this.changeCxpd = this.changeCxpd.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  getTableData () {
    const { data } = this.props
    const updateScore = this.updateScore
    universalFetch(`${__API__}base-score/${data.classId}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'Basic.js')
      }
      this.setState({
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            num: item.studentNumber,
            name: item.name,
            cxpk: item.behavior,
            dy: item.moral,
            wt: item.activity,
            xsky: item.academic + (item.academicDesc ? `(${item.academicDesc})` : ''),
            post: item.duty + (item.dutyDesc ? `(${item.dutyDesc})` : ''),
            operate: <span className={styles['operate']} onClick={function () { updateScore(item) }}>
              <Icon type='edit' />修改</span>
          }
        })
      })
    })
    .catch(handleFetchError)
  }
  handleCancel () {
    this.setState({
      visible: false
    })
  }
  handleOk (values) {
    const { modalData } = this.state
    const { cxpd, dy, wt, xsky, post, xskybz, postbz } = values
    const data = {
      systemId: modalData.systemId,
      moral: dy,
      behavior: cxpd,
      academic: xsky,
      academicDesc: xskybz,
      activity: wt,
      duty: post,
      dutyDesc: postbz
    }
    universalFetch(`${__API__}base-score`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'Basic.js')
      }
      this.getTableData()
      this.setState({
        visible: false
      })
      message.success('修改成功')
    })
    .catch(handleFetchError)
  }
  changeInput (e: Object) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  changeCxpd (value: string) {
    this.setState({
      cxpd: value
    })
  }
  componentWillMount () {
    this.getTableData()
  }
  updateScore (item: Object) {
    this.setState({
      visible: true,
      modalData: item,
      cxpd: item.behavior,
      dy: item.moral,
      wt: item.activity,
      xsky: item.academic,
      xskybz: item.academicDesc,
      post: item.duty,
      postbz: item.dutyDesc
    })
  }
  submitHandle = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.handleOk(values)
      }
    })
  }
  getData () {
    const { data } = this.props
    const updateScore = this.updateScore
    universalFetch(`${__API__}base-score/${data.classId}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'Basic.js')
      }
      this.setState({
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            num: item.studentNumber,
            name: item.name,
            cxpd: item.behavior,
            dy: item.moral,
            wt: item.activity,
            xsky: item.academic + `(${item.academicDesc})`,
            post: item.duty + `(${item.dutyDesc})`,
            operate: <span className={styles['operate']} onClick={function () { updateScore(item) }}>
              <Icon type='edit' />修改</span>
          }
        })
      })
    })
    .catch(handleFetchError)
  }
  render () {
    const columns = [{
      title: '学号',
      dataIndex: 'num',
      key: 'num'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '操行评定',
      dataIndex: 'cxpk',
      key: 'cxpk'
    }, {
      title: '德育',
      dataIndex: 'dy',
      key: 'dy'
    }, {
      title: '文体',
      dataIndex: 'wt',
      key: 'wt'
    }, {
      title: '学术科研',
      dataIndex: 'xsky',
      key: 'xsky'
    }, {
      title: '职务',
      dataIndex: 'post',
      key: 'post'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate'
    }]
    const { dataSource, cxpd, dy, wt, xsky, post, xskybz, postbz, modalData } = this.state
    const { getFieldDecorator } = this.props.form
    return <div className={styles['main']}>
      <Table columns={columns} pagination={false} dataSource={dataSource} />
      <Modal
        title='修改基本加分'
        visible={this.state.visible}
        onOk={this.submitHandle}
        onCancel={this.handleCancel}
        maskClosable={false}
        width={600}
        >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
          <div className={styles['row']}>
            <span className={styles['title']}>姓名：</span>
            {modalData.name}
          </div>
          <div className={styles['row']}>
            <span className={styles['title']}>学号：</span>
            {modalData.studentNumber}
          </div>
        </div>
        <div className={styles['modal-main']}>
          <Form>
            <FormItem
              labelCol={{ xs: { span: 5 } }}
              label={'操行评定：'}>
              {getFieldDecorator('cxpd', {
                rules: [{ required: true, message: '请输入操行评定!' }],
                initialValue: modalData.behavior
              })(
                <Select style={{ width: '150px' }} placeholder='新选择操行评定'>
                  <Option value='优'>优</Option>
                  <Option value='良'>良</Option>
                  <Option value='中'>中</Option>
                  <Option value='差'>差</Option>
                </Select>
              )}
            </FormItem>
            <Row>
              <Col span={12}>
                <div className={styles['row']}>
                  <FormItem
                    {...formItemLayout}
                    label={'德育：'}>
                    {getFieldDecorator('dy', {
                      rules: [{ required: true, message: '请输入德育分!' }],
                      initialValue: modalData.moral
                    })(
                      <Input style={{ width: '150px' }} placeholder='请输入德育分' />
                    )}
                  </FormItem>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className={styles['row']}>
                  <FormItem
                    {...formItemLayout}
                    label={'学术科研：'}>
                    {getFieldDecorator('xsky', {
                      rules: [{ required: true, message: '请输入学术科研分!' }],
                      initialValue: modalData.academic
                    })(
                      <Input style={{ width: '150px' }} placeholder='请输入学术科研分' />
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles['row']}>
                  <FormItem
                    {...formItemLayout}
                    label={'学术科研备注：'}>
                    {getFieldDecorator('xskybz', {
                      rules: [{ required: false, max: 50, message: '请确认学术科研备注!' }],
                      initialValue: modalData.academicDesc
                    })(
                      <Input style={{ width: '150px' }} placeholder='请输入学术科研备注' />
                    )}
                  </FormItem>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className={styles['row']}>
                  <FormItem
                    {...formItemLayout}
                    label={'职务：'}>
                    {getFieldDecorator('post', {
                      rules: [{ required: true, message: '请输入职务分!' }],
                      initialValue: modalData.duty
                    })(
                      <Input style={{ width: '150px' }} placeholder='请输入职务分' />
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles['row']}>
                  <FormItem
                    {...formItemLayout}
                    label={'职务分备注：'}>
                    {getFieldDecorator('postbz', {
                      rules: [{ required: false, max: 20, message: '请确认职务分备注!' }],
                      initialValue: modalData.dutyDesc
                    })(
                      <Input style={{ width: '150px' }} placeholder='请输入职务分备注' />
                    )}
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
}
const newBasic = Form.create()(Basic)
export default newBasic