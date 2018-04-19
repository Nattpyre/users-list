import React, { Component } from 'react';
import { Table, Divider, Button } from 'antd';
import './UsersList.css';

class UsersList extends Component {
  render() {
    return (
      <Table
        dataSource={this.props.users}
        columns={[
          {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name'
          },
          {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name'
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
          },
          {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone'
          },
          {
            title: 'About',
            dataIndex: 'about',
            key: 'about'
          },
          {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (text, record) => (
              <span>
                <Button icon="edit" className="user-action-btn" onClick={() => this.props.handleClickEdit(record)} />
                <Divider type="vertical" />
                <Button icon="delete" className="user-action-btn"
                        onClick={() => this.props.handleClickDelete(record.id)} />
              </span>
            )
          }
        ]}
        loading={this.props.isLoading}
        rowKey="id"
        onChange={this.props.handleTableChange}
        pagination={this.props.pagination}
      />
    );
  }
}

export default UsersList;
