import React, { Component } from 'react';
import { Layout, Input, Button, Modal } from 'antd';
import UsersList from '../UsersList';
import ManageUserModal from '../ManageUserModal';
import './App.css';

const { Header, Content } = Layout;
const Search = Input.Search;

const apiUrl = 'https://geenio-test-job.herokuapp.com/api/v1';
const apiKey = '7qHuwAcq9p5pGXJA';

class App extends Component {
  state = {
    users: [],
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    searchQuery: '',
    manageUserModalVisible: false,
    isLoading: false,
    selectedUser: null,
    error: null,
  };

  timer = 0;

  componentDidMount() {
    this.fetchUsers();
  }

  handleSearch = (e) => {
    const { pagination } = this.state;
    const value = e.target.value;

    pagination.current = 1;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.setState({
        searchQuery: value,
        pagination,
      }, () => {
        this.fetchUsers();
      });
    }, 500);
  };

  handleClickDelete = (id) => {
    Modal.confirm({
      title: 'Delete user',
      content: 'Are you sure what you want to delete this user?',
      confirmLoading: this.state.isLoading,
      onOk: () => {
        this.setState({
          isLoading: true,
        });

        fetch(`${apiUrl}/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            api_key: apiKey,
          })
        }).then(response => response.json()).then(data => {
          if (data.error) {
            this.setState({
              error: data.error,
              isLoading: false,
            });

            Modal.error({
              title: 'Whoops! Something went wrong.',
              content: 'Please try again later.',
            });

            return;
          }

          const { pagination } = this.state;

          pagination.current = 1;

          this.setState({
            error: false,
            isLoading: false,
            pagination,
          }, () => {
            this.fetchUsers();
          });
        });
      },
    })
  };

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };

    pager.current = pagination.current;

    this.setState({
      pagination: pager,
    }, () => {
      this.fetchUsers();
    });
  };

  manageUser = (url, method, data, resetForm) => {
    this.setState({
      isLoading: true,
    }, () => {
      fetch(url, {
        method,
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.assign(data, {
          api_key: apiKey,
        })),
      }).then(response => response.json()).then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
            isLoading: false,
          });

          return;
        }

        this.setState({
          error: false,
          isLoading: false,
          manageUserModalVisible: false,
          selectedUser: null,
        }, () => {
          resetForm();
          this.fetchUsers();
        });
      })
    });
  };

  fetchUsers = () => {
    this.setState({
      isLoading: true,
    });

    const offset = this.state.pagination.pageSize * (this.state.pagination.current - 1);

    fetch(`${apiUrl}/users?api_key=${apiKey}&offset=${offset}&name=${this.state.searchQuery}`, {
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
    }).then(response => response.json()).then((data) => {
      if (data.error) {
        this.setState({
          error: data.error,
          isLoading: false,
        });

        Modal.error({
          title: 'Whoops! Something went wrong.',
          content: 'Please try again later.',
        });

        return;
      }

      const { pagination } = this.state;

      pagination.total = data.total_count;

      this.setState({
        isLoading: false,
        users: data.users,
        pagination,
      });
    });
  };

  render() {
    return (
      <Layout className="layout">
        <Header>
          <h1 className="header-title">Test Task</h1>
          <Search
            placeholder="Search for users"
            onChange={this.handleSearch}
          />
        </Header>
        <Content>
          <div className="users-list-header">
            <h2>List of users</h2>
            <Button
              type="primary"
              icon="plus"
              onClick={() => this.setState({
                manageUserModalVisible: true,
              })}
            >
              Add new user
            </Button>
          </div>
          <UsersList
            users={this.state.users}
            isLoading={this.state.isLoading}
            pagination={this.state.pagination}
            handleClickEdit={(user) => this.setState({
              selectedUser: user,
              manageUserModalVisible: true,
            })}
            handleClickDelete={this.handleClickDelete}
            handleTableChange={this.handleTableChange}
          />
        </Content>
        <ManageUserModal
          title={this.state.selectedUser ? "Edit user" : "Add new user"}
          visible={this.state.manageUserModalVisible}
          isLoading={this.state.isLoading}
          error={this.state.error}
          selectedUser={this.state.selectedUser}
          handleConfirm={(data, resetForm) => {
            this.state.selectedUser ?
              this.manageUser(`${apiUrl}/users/${this.state.selectedUser.id}`, 'PUT', data, resetForm)
              :
              this.manageUser(`${apiUrl}/users`, 'POST', data, resetForm)
          }}
          handleCancel={() => this.setState({
            manageUserModalVisible: false,
            selectedUser: null,
          })}
        />
      </Layout>
    );
  }
}

export default App;
