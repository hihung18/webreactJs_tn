import React from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import PostNotification from "../utils";

const ProductsManagement = () => {
  const hostUsers = process.env.REACT_APP_HOST_USERS;
  const hostTask = process.env.REACT_APP_HOST_TASKS;
  const hostTrip = process.env.REACT_APP_HOST_TRIPS;
  const hostTaskNoti = process.env.REACT_APP_HOST_TASK_NOTI;

  const [showRate, setShowRate] = React.useState(false);
  const closeShowRate = () => setShowRate(false);
  const openShowRate = () => setShowRate(true);

  const [showAddTask, setShowAddTask] = React.useState(false);
  const closeAddTask = () => setShowAddTask(false);
  const openAddTask = () => setShowAddTask(true);

  const [showAddRate, setShowAddRate] = React.useState(false);
  const closeAddRate = () => setShowAddRate(false);
  const openAddRate = () => setShowAddRate(true);

  const [trips, setTrips] = React.useState([]);
  const [ratePost, setRatePost] = React.useState([]);

  const [rates, setRates] = React.useState([]);

  const [taskIdToGet, setTaskIdToGet] = React.useState(Number);

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
        // console.log(res);
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

  const getRates = (taskId) => {
    // console.log(taskId);
    fetch("http://localhost:8080/api/rates?taskID=" + taskId, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log("rates");
        // console.log(res);
        setRates(res);
      })
      .catch((err) => console.log(err));
  };

  const createRate = async () => {
    console.log(ratePost, taskIdToGet, userDetail.id);
    if (!ratePost.commentRate || ratePost.commentRate === "") {
      alert("Please enter commment!");
      return;
    }
    const response = await fetch(
      "http://localhost:8080/api/rates/listTokenDevice",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userDetail.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskID: taskIdToGet,
          userID: userDetail.id,
          commentRate: ratePost.commentRate,
          time_cre_rate: currentDate,
        }),
      }
    );
    if (!response.ok) {
      alert("Error!");
      throw new Error("Error");
    }

    const data = await response.json();
    const tokendevice = data.listTokenDevice;
    if (tokendevice !== "") {
      PostNotification(tokendevice, "", "RATE");
    }
    closeAddRate();
    window.location = "/tasks/" + params.id + "/manager/" + params.managerid + "/status/" + params.statustrip;
    
    alert("Success!");
  };

  const createTask = async () => {
    if (!taskPost.userID || taskPost.userID === "N") {
      alert("Please choose a user!");
      return;
    }
    if (!taskPost.nameTask || taskPost.nameTask.trim() === "") {
      alert("Please enter Task name!");
      return;
    }
    if (!taskPost.detailTask || taskPost.detailTask.trim() === "") {
      alert("Please enter Task detail!");
      return;
    }
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
      PostNotification(data.tokenDevice, data.userFullName, "TASK");
    }
    closeAddTask();
    window.location = "/tasks/" + params.id + "/manager/" + params.managerid + "/status/" + params.statustrip;
    alert("Success!");
  };

  const updateTask = async (task, statusConfirm = 9999, statusComplete = 9999) => {
    console.log(statusConfirm);
    console.log(task);
    const response = await fetch(hostTask + task.taskId, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: task.taskId,
        businessTripID: task.businessTripID,
        userID: task.userID,
        nameTask: task.nameTask,
        detailTask: task.detailTask,
        statusConfirm: statusConfirm === 9999 ? task.statusConfirm : -1,
        statusCheckIn: task.statusCheckIn,
        statusComplete: statusComplete === 9999? task.statusComplete : statusComplete,
        time_cre_task: task.time_cre_task,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    window.location = "/tasks/" + params.id + "/manager/" + params.managerid + "/status/" + params.statustrip;


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
    window.location = "/tasks/" + params.id + "/manager/" + params.managerid + "/status/" + params.statustrip;

    
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
    const result = users.find((user) => user.userId === id);
    if (result) {
      return result.fullName;
    } else {
      return "Unknown User";
    }
  };

  const getTripNameById = (id) => {
    const result = trips.find((trip) => trip.businessTripId === id);
    if (result) {
      return result.name_trip;
    } else {
      return "Unknown";
    }
  };

  console.log(userDetail.id, params.managerid);
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            {userDetail.id === parseInt(params.managerid) && (parseInt(params.statustrip) === 0 || parseInt(params.statustrip) === 1) && (
              <Button variant="info" onClick={openAddTask} className="btn-add">
                Add Task
              </Button>
            )}
          </div>
          <div className="bg">
            <div className="bg-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr style={{ color: "black", fontSize: "14px" }}>
                    <th>STT</th>
                    <th style={{ width: "200px" }}>Business Trip</th>
                    <th style={{ width: "150px" }}>User</th>
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
                      <tr key={index} style={{ color: "black", fontSize: "14px" }}>
                        <td>{index + 1}</td>
                        <td>{getTripNameById(task.businessTripID)}</td>
                        <td>{getUseNamerById(task.userID)}</td>
                        <td>{task.nameTask}</td>
                        <td>{task.detailTask}</td>
                        <td>
                          {task.statusConfirm === -1 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-red"
                            >
                              Refused
                            </text>
                          ) : task.statusConfirm === 0 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-red"
                            >
                              Confirm
                            </text>
                          ) : (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-green"
                            >
                              Confirmed
                            </text>
                          )}
                        </td>
                        <td>
                          {task.statusCheckIn === 0 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-red"
                            >
                              Checkin
                            </text>
                          ) : (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-green"
                            >
                              Checkin
                            </text>
                          )}
                          {/* {task.statusCheckIn === 0
                            //   ? "Chưa Checkin"
                            //   : "Da Checkin"} */}
                        </td>
                        <td>
                          {task.statusComplete === 1 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-red"
                            >
                              Finished
                            </text>
                          ) : task.statusComplete === 2 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-yellow"
                            >
                              Censoring
                            </text>
                          ) : (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-green"
                            >
                              Finished
                            </text>
                          )}
                        </td>
                        <td>{getDate(task.time_cre_task)}</td>
                        <td>
                          {task.statusConfirm === 1 && (
                            <button
                              style={{ width: "60px" }}
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm("Cancel it?"))
                                 {setTaskUpdate(task);
                                  updateTask(task, -1);}
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                        
                        <td>
                          {task.statusComplete === 2 && (
                            <button
                              style={{ width: "60px" }}
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm("Confirm it?"))
                                  setTaskUpdate(task);
                                updateTask(task.taskId);
                              }}
                            >
                              Confirm
                            </button>
                          )}
                        </td>
                        <td>
                          {userDetail.id === parseInt(params.managerid) && task.statusConfirm !== 1 && (
                            <button
                              style={{ width: "60px" }}
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm("Delete it?"))
                                  deleteTask(task.taskId);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                        <td style={{ paddingLeft: "34px" }}>
                          <button
                            style={{ width: "100px" }}
                            className="btn-update"
                            onClick={() => {
                              setTaskIdToGet(task.taskId);
                              getRates(task.taskId);
                              openShowRate(task.taskId);
                            }}
                          >
                            Conversation
                          </button>
                        </td>
                        <td>
                          <Link to={"/reports-task/" + task.taskId}>
                            <button
                              style={{ width: "80px" }}
                              className="btn-update"
                            >
                              Review
                            </button>
                          </Link>
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

          {/* view rates */}
          <Modal show={showRate} onHide={closeShowRate}>
            <Modal.Header closeButton>
              <Modal.Title>Conversation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>STT</th>
                    {/* <th style={{ width: "200px" }}>Business Trip</th> */}
                    <th style={{ width: "80px" }}>User</th>
                    <th style={{ width: "140px" }}>Comment</th>
                    <th style={{ width: "100px" }}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {/* <td>{getTripNameById(rate.businessTripID)}</td> */}
                      <td>{getUseNamerById(rate.userID)}</td>
                      <td>{rate.commentRate}</td>
                      <td>{getDate(rate.time_cre_rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              {userDetail.id === parseInt(params.managerid) && (parseInt(params.statustrip) === 0 || parseInt(params.statustrip) === 1) && <Button variant="primary" onClick={openAddRate}>
                Add
              </Button>}
              <Button variant="secondary" onClick={closeShowRate}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* add rate */}
          <Modal className="modal" show={showAddRate} onHide={closeAddRate}>
            <Modal.Header closeButton>
              <Modal.Title>Add Conversation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    id="inputComment"
                    type="text"
                    placeholder="Comment"
                    onChange={(e) =>
                      setRatePost({
                        ...ratePost,
                        commentRate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeAddRate}>
                Close
              </Button>
              <Button variant="primary" onClick={createRate}>
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
