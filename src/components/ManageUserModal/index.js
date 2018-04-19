import React, { Component } from 'react';
import { Alert, Input, Modal, Form } from 'antd';
import './ManageUserModal.css';

const { TextArea } = Input;
const FormItem = Form.Item;

class ManageUserModal extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
      },
    };

    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        confirmLoading={this.props.isLoading}
        onOk={() => {
          this.props.handleConfirm(this.props.form.getFieldsValue(), this.props.form.resetFields);
        }}
        onCancel={() => {
          this.props.handleCancel();
          this.props.form.resetFields();
        }}
      >
        {
          this.props.error ? <Alert message={this.props.error} type="error" /> : null
        }
        <Form layout="vertical">
          <FormItem
            {...formItemLayout}
            label="First Name:"
          >
            {getFieldDecorator('first_name', {
              initialValue: this.props.selectedUser ? this.props.selectedUser.first_name : null,
              rules: [{
                required: true, message: 'This field cannot be blank.',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Last Name:"
          >
            {getFieldDecorator('last_name', {
              initialValue: this.props.selectedUser ? this.props.selectedUser.last_name : null,
              rules: [{
                required: true, message: 'This field cannot be blank.',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Email:"
          >
            {getFieldDecorator('email', {
              initialValue: this.props.selectedUser ? this.props.selectedUser.email : null,
              rules: [{
                type: 'email', message: 'Please enter valid email address.',
              }, {
                required: true, message: 'This field cannot be blank.',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Phone:"
          >
            {getFieldDecorator('phone', {
              initialValue: this.props.selectedUser ? this.props.selectedUser.phone : null,
              rules: [{
                required: true, message: 'This field cannot be blank.',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="About (optional):"
          >
            {getFieldDecorator('about', {
              initialValue: this.props.selectedUser ? this.props.selectedUser.about : null,
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ManageUserModal);