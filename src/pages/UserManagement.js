import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
const UsersManagement = () => {
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  const hostUsers = process.env.REACT_APP_HOST_USERS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAdd = () => setShowAdd(false);
  const openAdd = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdateUser = () => setUpdate(false);
  const openUpdateUser = () => setUpdate(true);

  const [userUpdate, setUserUpdate] = React.useState({});
  const [userPost, setUserPost] = React.useState({});

  const [users, setUsers] = React.useState([]);
  const [usersFollowRole, setUsersFollowRole] = React.useState([]);
  const [roleSelected, setRoleSelected] = React.useState("ALL");

  React.useEffect(() => {
    fetch(hostUsers, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
      },
    })
      .then((res) => res.json())
      .then((users) => {
        setUsers(users);
        setUsersFollowRole(users);
      })
      .catch((err) => console.log(err));
  }, [hostUsers, userDetail.token]);

  const createUser = async () => {
    const response = await fetch(hostUsers, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userPost.email,
        username: userPost.username,
        password: userPost.password,
        fullName: userPost.fullName,
        phoneNumber: userPost.phoneNumber,
        address: userPost.address,
        roleName: userPost.roleName,
      }),
    });
    if (!response.ok) {
      alert("Error!");
      closeAdd();
      throw new Error("Error");
    }
    closeAdd();
    window.location = "/users";
    alert("Success!");
  };

  const DeleteUser = async (id) => {
    console.log(id);
    const response = await fetch(hostUsers + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Error!");
      throw new Error("Failed to delete user");
    }
    const data = await response.json();
    console.log(data);
    const updatedUser1 = usersFollowRole.filter((user) => user.id !== id);
    const updatedUser2 = users.filter((user) => user.id !== id);
    setUsersFollowRole(updatedUser1);
    setUsers(updatedUser2);
    window.location = "/users";
    alert("Success!");
  };

  const UpdateUser = async (id) => {
    console.log(userUpdate);
    const response = await fetch(hostUsers + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userUpdate.userId,
        email: userUpdate.email,
        username: userUpdate.username,
        password:"",
        fullName: userUpdate.fullName,
        phoneNumber: userUpdate.phoneNumber,
        address: userUpdate.address,
        tokeDevice: userUpdate.tokeDevice,
        roleName: userUpdate.roleName,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    console.log(data);
    window.location = "/users";

    let updateUsers1 = usersFollowRole.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          email: userUpdate.email,
          role: userUpdate.role,
          firstName: userUpdate.firstName,
          lastName: userUpdate.lastName,
          address: userUpdate.address,
        };
      }
      return user;
    });
    let updateUsers2 = users.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          email: userUpdate.email,
          role: userUpdate.role,
          firstName: userUpdate.firstName,
          lastName: userUpdate.lastName,
          address: userUpdate.address,
        };
      }
      return user;
    });
    setUsersFollowRole(updateUsers1);
    if (roleSelected !== "ALL") {
      let updatedUsersRole1 = updateUsers1.filter(
        (user) => user.role === roleSelected
      );
      setUsersFollowRole(updatedUsersRole1);
    }

    setUsers(updateUsers2);
  };

  const SetUserFollowRole = (userRole) => {
    if (userRole !== "ALL") {
      let usersFollowRole = users.filter((user) => user.roleName === userRole);
      setUsersFollowRole(usersFollowRole);
    } else {
      setUsersFollowRole(users);
    }
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAdd} className="btn-add">
              Add User
            </Button>
            <div className="select">
              <select
                className="form-select"
                id="select-option"
                onChange={(e) => {
                  SetUserFollowRole(e.target.value);
                  setRoleSelected(e.target.value);
                }}
              >
                <option value="ALL">All user</option>
                <option value="ROLE_QL">ROLE_QL</option>
                <option value="ROLE_NV">ROLE_NV</option>
              </select>
            </div>
          </div>
          <div className="bg">
            <div className="bg-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>STT</th>
                    <th style={{ width: "120px" }}>Username</th>
                    <th style={{ width: "150px" }}>Full name</th>
                    <th style={{ width: "200px" }}>Email</th>
                    <th>Phone</th>
                    <th style={{ width: "150px" }}>Address</th>
                    <th style={{ width: "150px" }}>Token Device</th>
                    <th>Role</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {usersFollowRole &&
                    usersFollowRole.map((user, index) => (
                      <tr key={user.userId}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.address}</td>
                        <td style={{}}>
                          {user.tokeDevice?.length > 10 ? (
                            <span className="truncate-text">
                              {user.tokeDevice.slice(0, 10)}...
                            </span>
                          ) : (
                            user.tokeDevice
                          )}
                        </td>
                        <td>
                          <button className="btn-outline-status">
                            {user.roleName}
                          </button>
                        </td>
                        <td>
                          {user.roleName==="ROLE_NV" && <button
                            className="btn-update"
                            onClick={() => {
                              setUserUpdate(user);
                              openUpdateUser();
                            }}
                          >
                            update
                          </button>}
                        </td>
                        
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* add user */}
      <Modal className="modal" show={showAdd} onHide={closeAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="inputName"
                type="text"
                placeholder="Email"
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                id="inputUsername"
                type="text"
                placeholder="Username"
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    username: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="inputPassword"
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    password: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                id="inputFullName"
                type="text"
                placeholder="Full Name"
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    fullName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                id="inputPhoneNumber"
                type="text"
                placeholder="Phone Number"
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                id="inputAddress"
                type="text"
                placeholder="Address"
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setUserPost({
                    ...userPost,
                    roleName: e.target.value,
                  })
                }
              >
                <option value="ROLE_QL">"ROLE_QL"</option>
                <option value="ROLE_NV">"ROLE_NV"</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={createUser}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update user */}
      <Modal show={showUpdate} onHide={closeUpdateUser}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                id="inputUserName"
                type="text"
                value={userUpdate.username}
                placeholder="User name"
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="inputEmail"
                type="text"
                value={userUpdate.email}
                placeholder="Email"
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                id="inputFullName"
                type="text"
                placeholder="Full name"
                value={userUpdate.fullName}
                readOnly={true}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    fullName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                id="inputPhoneNumber"
                type="text"
                placeholder="Phone Number"
                value={userUpdate.phoneNumber}
                readOnly={true}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                id="inputAddress"
                type="text"
                placeholder="Address"
                value={userUpdate.address}
                readOnly={true}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Token Device</Form.Label>
              <Form.Control
                id="inputTokenDevice"
                type="text"
                placeholder="Token"
                value={userUpdate.tokeDevice}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    tokeDevice: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateUser}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdateUser(userUpdate.userId);
              closeUpdateUser();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersManagement;
