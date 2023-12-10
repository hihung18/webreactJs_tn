import React from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
import PostNotification from "../utils";

const ProductsManagement = () => {
  const hostUsers = process.env.REACT_APP_HOST_USERS;
  const hostTask = process.env.REACT_APP_HOST_TASKS;
  const hostTrip = process.env.REACT_APP_HOST_TRIPS;
  const hostTaskNoti = process.env.REACT_APP_HOST_TASK_NOTI;



  const [showAddTask, setShowAddTask] = React.useState(false);
  const closeAddTask = () => setShowAddTask(false);
  const openAddTask = () => setShowAddTask(true);

  const [showUpdateTask, setShowUpdateTask] = React.useState(false);
  const closeUpdateTask = () => setShowUpdateTask(false);
  const openUpdateTask = () => setShowUpdateTask(true);

  const [trips, setTrips] = React.useState([]);


  const [businessTripIDToGet, setBusinessTripIDToGet] = React.useState(Number);

  const currentDate = new Date();

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [users, setUsers] = React.useState([]);
  const [usersNV, setUsersNV] = React.useState([]);
  const [usersQL, setUsersQL] = React.useState([]);

  const [tasks, setTasks] = React.useState([]);
  const [taskPost, setTaskPost] = React.useState({});
  const [taskUpdate, setTaskUpdate] = React.useState({});

  let params = useParams();

  React.useEffect(() => {
    fetch("http://localhost:8080/api/tasks?businessTripID=" + params.id, {
        headers: {
          Authorization: "Bearer " + userDetail.token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setTasks(res);
          console.log(res);
        })
        .catch((err) => console.log(err));

    fetch(hostTrip, {
        headers: {
            Authorization: "Bearer " + userDetail.token,
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((res) => {
            setTrips(res);
        })
        .catch((err) => console.log(err));

    fetch(hostUsers, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
      },
    })
      .then((res) => res.json())
      .then((users) => {
        setUsers(users);
        const usersNV = users.filter((user) => user.roleName === "ROLE_NV");
        setUsersNV(usersNV);
        const usersQL = users.filter((user) => user.roleName === "ROLE_QL");
        setUsersQL(usersQL);
      })
      .catch((err) => console.log(err));
  }, [hostUsers, hostTrip, params.id, userDetail.token]);

  const createTask = async () => {
    const response = await fetch(hostTaskNoti, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessTripID: params.id,
        userID: taskPost.userID,
        nameTask: taskPost.nameTask,
        detailTask: taskPost.detailTask,
        statusConfirm: 0,
        statusCheckIn: 0,
        statusComplete: 1,
        time_cre_task: currentDate,
      }),
    });

    if (!response.ok) {
      alert("Error!");
      closeAddTask();
      throw new Error("Error");
    }

    const data = await response.json();
    console.log(data.tokenDevice);
    if (data.tokenDevice !== "") {
      PostNotification(data.tokenDevice, data.userFullName, "TASK")
    }
    closeAddTask();
    window.location = "/tasks/"+params.id;
    alert("Success!");
  };

  const updateTask = async (id) => {
    console.log(taskUpdate);
    const response = await fetch(hostTask + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: taskUpdate.taskId,
        businessTripID: taskUpdate.businessTripID,
        userID: taskUpdate.userID,
        nameTask: taskUpdate.nameTask,
        detailTask: taskUpdate.detailTask,
        statusConfirm: taskUpdate.statusConfirm,
        statusCheckIn: taskUpdate.statusCheckIn,
        statusComplete: 3,
        time_cre_task: taskUpdate.time_cre_task,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    window.location = "/tasks/"+params.id;
    alert("Success!");
  };

  const deleteTask = async (id) => {
    console.log("delete device has id: " + id);
    const response = await fetch(hostTask + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Error!");
      throw new Error("Error!");
    }
    alert("Success");
    window.location = "/tasks/"+params.id;
  };

  const getDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const result = day + "/" + month + "/" + year;

    return result;
  };

  const getUseNamerById = (id) => {
    const result = users.find(user => user.userId === id);
    if (result) {
      return result.fullName;
    } else {
      return "Unknown User";
    }
  }

  const getTripNameById = (id) => {
    const result = trips.find(trip => trip.businessTripId === id)
    if (result) {
        return result.name_trip;
      } else {
        return "Unknown";
      }
  }

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAddTask} className="btn-add">
              Add Task
            </Button>
          </div>
          <div className="card">
            <div className="card-body">
            <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th style={{ width: "200px"}}>Business Trip</th>
                    <th style={{ width: "150px"}}>User</th>
                    <th style={{ width: "160px" }}>Task name</th>
                    <th style={{ width: "350px" }}>Detail</th>
                    <th style={{ width: "100px" }}>Status Confirm</th>
                    <th style={{ width: "100px" }}>Status Check-in</th>
                    <th style={{ width: "100px" }}>Status Finish</th>
                    <th style={{ width: "140px" }}>Created at</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks &&
                    tasks.map((task, index) => (
                        <tr key={index} style={{ verticalAlign: "middle" }}>
                          <td>{index+1}</td>
                          <td>
                            {getTripNameById(task.businessTripID)}
                          </td>
                          <td>
                            {getUseNamerById(task.userID)}
                          </td>
                          <td>{task.nameTask}</td>
                          <td>{task.detailTask}</td>
                          <td>
                            {task.statusConfirm === -1
                              ? <text
                                  style={{ width: "60px" }}
                                  className="text-bg-red"
                                >
                                  Refused
                                </text>
                              : task.statusConfirm === 0
                              ? <text
                                  style={{ width: "60px" }}
                                  className="text-bg-red"
                                >
                                  Confirm
                                </text>
                              : <text
                                  style={{ width: "60px" }}
                                  className="text-bg-green"
                                >
                                  Confirmed
                                </text>
                            }
                          </td>
                          <td >
                          {task.statusCheckIn === 0
                              ?<text
                                style={{ width: "60px" }}
                                className="text-bg-red"
                              >
                                Checkin
                              </text>

                              :<text
                                style={{ width: "60px" }}
                                className="text-bg-green"
                              >
                                Checkin
                              </text>
                            }
                             {/* {task.statusCheckIn === 0
                            //   ? "Chưa Checkin"
                            //   : "Da Checkin"} */}
                          </td>
                          <td>
                            {task.statusComplete === 1
                              ? <text
                                  style={{ width: "60px" }}
                                  className="text-bg-red"
                                >
                                  Finished
                                </text>
                              : task.statusComplete === 2
                              ?<text
                                  style={{ width: "60px" }}
                                  className="text-bg-yellow"
                                >
                                  Censoring
                                </text>
                              : <text
                                  style={{ width: "60px" }}
                                  className="text-bg-green"
                                >
                                  Finished
                                </text>
                              }
                          </td>
                          <td>{getDate(task.time_cre_task)}</td>
                          <td>
                            {task.statusComplete === 2 && 
                              <button
                                style={{ width: "60px" }}
                                className="btn-delete"
                                onClick={() => {
                                  if (window.confirm("Confirm it?"))
                                    setTaskUpdate(task)
                                    updateTask(task.taskId);
                                }}
                              >
                                Confirm
                              </button>
                            }
                          </td>
                          <td>
                            { task.statusConfirm !== 1 && 
                              <button
                                style={{ width: "60px" }}
                                className="btn-delete"
                                onClick={() => {
                                  if (window.confirm("Delete it?"))
                                    deleteTask(task.taskId);
                                }}
                              >
                                delete
                              </button>
                            }
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* add task */}
          <Modal className="modal" show={showAddTask} onHide={closeAddTask}>
            <Modal.Header closeButton>
              <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Trip ID</Form.Label>
                  <Form.Control
                    id="inputTripID"
                    type="text"
                    readOnly={true}
                    value={params.id}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setTaskPost({
                        ...taskPost,
                        userID: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={"N"}>--Select--</option>
                    {usersNV?.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.username}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    id="inputName"
                    type="text"
                    placeholder="Name"
                    onChange={(e) =>
                      setTaskPost({
                        ...taskPost,
                        nameTask: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Detail</Form.Label>
                  <Form.Control
                    id="inputDetail"
                    type="text"
                    placeholder="Detail"
                    onChange={(e) =>
                      setTaskPost({
                        ...taskPost,
                        detailTask: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Row} className="mp-3"></Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeAddTask}>
                Close
              </Button>
              <Button variant="primary" onClick={createTask}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          
        </div>
      </div>
    </>
  );
};

export default ProductsManagement;
