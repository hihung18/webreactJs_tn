import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PostNotification from "../utils";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProductsManagement = () => {
  // Authorization
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  // Endpoint
  const hostTrip = process.env.REACT_APP_HOST_TRIPS;
  const hostUsers = process.env.REACT_APP_HOST_USERS;
  const hostTask = process.env.REACT_APP_HOST_TASKS;
  const hostRate = process.env.REACT_APP_HOST_RATES;
  const hostRateNoti = process.env.REACT_APP_HOST_RATE_NOTI;
  const hostPartners = process.env.REACT_APP_HOST_PARTNERS;

  // Set state Form
  const [showAddTrip, setShowAddTrip] = React.useState(false);
  const closeAddTrip = () => setShowAddTrip(false);
  const openAddTrip = () => setShowAddTrip(true);

  const [showUpdateTrip, setShowUpdateTrip] = React.useState(false);
  const closeUpdateTrip = () => setShowUpdateTrip(false);
  const openUpdateTrip = () => setShowUpdateTrip(true);

  const [showAddTask, setShowAddTask] = React.useState(false);
  const closeAddTask = () => setShowAddTask(false);
  const openAddTask = () => setShowAddTask(true);

  const [showUpdateTask, setShowUpdateTask] = React.useState(false);
  const closeUpdateTask = () => setShowUpdateTask(false);
  const openUpdateTask = () => setShowUpdateTask(true);

  const [showRate, setShowRate] = React.useState(false);
  const closeShowRate = () => setShowRate(false);
  const openShowRate = () => setShowRate(true);

  const [showAddRate, setShowAddRate] = React.useState(false);
  const closeAddRate = () => setShowAddRate(false);
  const openAddRate = () => setShowAddRate(true);

  const [showTask, setShowTask] = React.useState(false);
  const closeShowTask = () => setShowTask(false);
  const openShowTask = () => setShowTask(true);

  // Set state variable
  const [trips, setTrips] = React.useState([]);
  const [tripPost, setTripPost] = React.useState({});
  const [tripUpdate, setTripUpdate] = React.useState({});

  const [tasks, setTasks] = React.useState([]);
  const [taskPost, setTaskPost] = React.useState({});
  const [taskUpdate, setTaskUpdate] = React.useState({});

  const [rates, setRates] = React.useState([]);
  const [ratePost, setRatePost] = React.useState([]);

  const [partners, setPartners] = React.useState([]);

  const [users, setUsers] = React.useState([]);
  const [usersNV, setUsersNV] = React.useState([]);
  const [usersQL, setUsersQL] = React.useState([]);

  const [businessTripIDToGet, setBusinessTripIDToGet] = React.useState(Number);
  const currentDate = new Date();

  React.useEffect(() => {
    fetch(hostTrip, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTrips(res);
        setTripsFollowStatus(res); 
        setTripsFollowStatusHistory(res); 
      })
      .catch((err) => console.log(err));

    fetch(hostTask, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTasks(res);
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

    fetch(hostRate, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("rates");
        console.log(res);
        setRates(res);
      })
      .catch((err) => console.log(err));

    fetch(hostPartners, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
      },
    })
      .then((res) => res.json())
      .then((users) => {
        setPartners(users);
      })
      .catch((err) => console.log(err));
  }, [hostTrip, hostTask, hostUsers, hostPartners, userDetail.token]);

  const getRates = (tripId) => {
    fetch("http://localhost:8080/api/rates?businessTripID=" + tripId, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("rates");
        console.log(res);
        setRates(res);
      })
      .catch((err) => console.log(err));
  };

  const getDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const result = day + "/" + month + "/" + year;

    return result;
  };

  const createTrip = async () => {
    console.log(tripPost);
    if (!tripPost.partnerID || tripPost.partnerID === "N") {
      alert("Please choose a partner!");
      return;
    }
    if (!tripPost.name_trip || tripPost.name_trip.trim() === "") {
      alert("Please enter BusinessTrip Name!");
      return;
    }
    if (!tripPost.detail_trip || tripPost.detail_trip.trim() === "") {
      alert("Please enter BusinessTrip Detail!");
      return;
    }
    if (!tripPost.location_trip || tripPost.location_trip.trim() === "") {
      alert("Please enter BusinessTrip Location!");
      return;
    }
    if (!tripPost.time_begin_trip) {
      alert("Please choose time begin!");
      return;
    }if (!tripPost.time_end_trip) {
      alert("Please choose time end!");
      return;
    }
    if (tripPost.time_begin_trip && tripPost.time_end_trip) {
      const beginDate = new Date(tripPost.time_begin_trip);
      const endDate = new Date(tripPost.time_end_trip);
  
      if (endDate < beginDate) {
        alert("End date before begin date!");
        return;
      }
    }
    const response = await fetch(hostTrip, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessTripId:0,
        managerID: userDetail.id,
        partnerID: tripPost.partnerID,
        name_trip: tripPost.name_trip,
        detail_trip: tripPost.detail_trip,
        location_trip: tripPost.location_trip,
        latitudeTrip: tripPost.latitudeTrip,
        longitudeTrip: tripPost.longitudeTrip,
        time_begin_trip: tripPost.time_begin_trip,
        time_end_trip: tripPost.time_end_trip,
        time_cre_trip: currentDate,
        statusBusinessTrip: 0,
      }),
    });
    if (!response.ok) {
      alert("Error!");
      console.log(response);
      closeAddTrip();
      throw new Error("Error");
    }
    closeAddTrip();
    window.location = "/business-trip";
    alert("Success!");
  };

  const updateTrip = async (id) => {
    console.log(tripUpdate);
    const response = await fetch(hostTrip + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessTripId: tripUpdate.businessTripId,
        managerID: tripUpdate.managerID,
        partnerID: tripUpdate.partnerID,
        name_trip: tripUpdate.name_trip,
        detail_trip: tripUpdate.detail_trip,
        location_trip: tripUpdate.location_trip,
        latitudeTrip: tripUpdate.latitudeTrip,
        longitudeTrip: tripUpdate.longitudeTrip,
        time_begin_trip: tripUpdate.time_begin_trip,
        time_end_trip: tripUpdate.time_end_trip,
        time_cre_trip: tripUpdate.time_cre_trip,
        statusBusinessTrip: tripUpdate.statusBusinessTrip,
      }),
    });
    if (!response.ok) {
      alert("Error!");
      
      closeUpdateTrip();
      throw new Error("Error");
    }
    closeUpdateTrip();
    window.location = "/business-trip";
    alert("Success!");
  };

  const deleteTrip = async (id) => {
    console.log(id);
    const response = await fetch(hostTrip + id, {
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
    window.location = "/business-trip";
    alert("Success!");
  };

  const createRate = async () => {
    console.log(ratePost);
    const response = await fetch(hostRateNoti, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessTripID: businessTripIDToGet,
        userID: userDetail.id,
        commentRate: ratePost.commentRate,
        time_cre_rate: currentDate,
      }),
    });
    if (!response.ok) {
      alert("Error!");
      throw new Error("Error");
    }

    const data = await response.json();
    const listToken = data.listTokenDevice;
    if (listToken.length !== 0) {
      listToken.map((token) => {
        if (token !== "") {
          PostNotification(token, "", "RATE");
        }
      });
    }
    closeAddRate();
    window.location = "/business-trip";
    alert("Success!");
  };

  const getUseNamerById = (id) => {
    const result = users.find((user) => user.userId === id);
    if (result) {
      return result.fullName;
    } else {
      return "Unknown User";
    }
  };

  const getPartnerNamerById = (id) => {
    const result = partners.find((partner) => partner.partnerId === id);
    if (result) {
      return result.name_pn;
    } else {
      return "Unknown User";
    }
  };
  const [tripsFollowStatus, setTripsFollowStatus] = React.useState([]);
  const SetTripFollowStatus = (statusCode) => {
    if (statusCode !== -1) {
      let newTrips = trips.filter((trip) => trip.statusBusinessTrip === statusCode);
      console.log(newTrips);
      setTripsFollowStatus(newTrips);
    } else {
      setTripsFollowStatus(trips);
    }
  };
  const [tripsFollowStatusHistory, setTripsFollowStatusHistory] = React.useState([]);
  const SetTripFollowStatusHistory = (statusCode) => {
    if (statusCode !== -1) {
      let newTrips = trips.filter((trip) => trip.statusBusinessTrip === statusCode);
      console.log(newTrips);
      setTripsFollowStatusHistory(newTrips);
    } else {
      console.log(trips);
      setTripsFollowStatusHistory(trips);
    }
  };
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAddTrip} className="btn-add">
              Add Trip
            </Button>
          </div>
          <div className="bg">
            <div className="bg-body">
              <div className="select">
                <select
                  className="form-select"
                  id="select-option"
                  onChange={(e) => {
                    SetTripFollowStatus(parseInt(e.target.value));
                  }}
                >
                  <option value={-1}>All</option>
                  <option value={0}>PREPARING</option>
                  <option value={1}>PROCESSING</option>
                </select>
              </div>
              <Table className="table-products table-hover">
                <thead>
                  <tr style={{ color: "black", fontSize: "14px" }}>
                    <th style={{ width: "40px" }}>STT</th>
                    <th style={{ width: "80px" }}>Manager</th>
                    <th style={{ width: "110px" }}>Partner</th>
                    <th style={{ width: "200px" }}>Name</th>
                    <th style={{ width: "300px" }}>Detail</th>
                    <th style={{ width: "250px" }}>Location</th>
                    <th style={{ width: "100px" }}>Coordinates</th>
                    <th style={{ width: "120px" }}>Time begin</th>
                    <th style={{ width: "100px" }}>Time end</th>
                    <th style={{ width: "100px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tripsFollowStatus
                    .filter(
                      (trip) =>
                        trip.statusBusinessTrip === 0 ||
                        trip.statusBusinessTrip === 1
                    )
                    .map((trip, index) => (
                      <tr key={index} style={{ color: "black", fontSize: "14px" }} >
                        <td>{index + 1}</td>
                        <td>{getUseNamerById(trip.managerID)}</td>
                        <td>{getPartnerNamerById(trip.partnerID)}</td>
                        <td>{trip.name_trip}</td>
                        <td>{trip.detail_trip}</td>
                        <td>{trip.location_trip}</td>
                        <td>
                          {trip.latitudeTrip} {trip.longitudeTrip}
                        </td>
                        <td>{getDate(trip.time_begin_trip)}</td>
                        <td>{getDate(trip.time_end_trip)}</td>
                        <td>
                          {trip.statusBusinessTrip === 0 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-yellow"
                            >
                              PREPARING
                            </text>
                          ) : trip.statusBusinessTrip === 1 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-orange"
                            >
                              PROCESSING
                            </text>
                          ) : (
                            ""
                          )}
                        </td>

                        <td>
                          {trip.managerID === userDetail.id &&
                            trip.statusBusinessTrip === 1 && (
                              <button
                                className="btn-delete"
                                onClick={() => {
                                  setTripUpdate(trip);
                                  openUpdateTrip();
                                }}
                              >
                                POSTPONE
                              </button>
                            )}
                        </td>

                        <td style={{ width: "100px" }}>
                          {trip.managerID === userDetail.id &&
                            trip.statusBusinessTrip === 0 && (
                              <button
                                className="btn-delete"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you wish to delete this item?"
                                    )
                                  )
                                    deleteTrip(trip.businessTripId);
                                }}
                              >
                                Delete
                              </button>
                            )}
                        </td>
                        <td>
                          <Link
                            to={
                              "/tasks/" +
                              trip.businessTripId +
                              "/manager/" +
                              trip.managerID +
                              "/status/" +
                              trip.statusBusinessTrip
                            }
                          >
                            <button
                              style={{ width: "80px" }}
                              className="btn-update"
                            >
                              Tasks
                            </button>
                          </Link>
                        </td>
                        <td >
                          <button
                            style={{ width: "100px" }}
                            className="btn-update"
                            onClick={() => {
                              setBusinessTripIDToGet(trip.businessTripId); // Make sure it matches the actual property name
                              getRates(trip.businessTripId);
                              openShowRate();
                            }}
                          >
                            Conversation 
                          </button>
                        </td>
                        <td>
                          <Link to={"/reports-trip/" + trip.businessTripId}>
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

              <div className="history">
                HISTORY
              </div>
              <div className="select">
                <select
                  className="form-select"
                  id="select-option"
                  onChange={(e) => {
                    SetTripFollowStatusHistory(parseInt(e.target.value));
                  }}
                >
                  <option value={-1}>All</option>
                  <option value={2}>FINISHED</option>
                  <option value={3}>COMPLETED</option>
                  <option value={4}>POSTPONE</option>
                </select>
              </div>
              <Table className="table-products table-hover">
                <thead>
                  <tr style={{ color: "black", fontSize: "14px" }}>
                    <th style={{ width: "60px" }}>STT</th>
                    <th style={{ width: "80px" }}>Manager</th>
                    <th style={{ width: "80px" }}>Partner</th>
                    <th style={{ width: "130px" }}>Name</th>
                    <th style={{ width: "250px" }}>Detail</th>
                    <th style={{ width: "250px" }}>Location</th>
                    <th style={{ width: "100px" }}>Coordinates</th>
                    <th style={{ width: "100px" }}>Time begin</th>
                    <th style={{ width: "100px" }}>Time end</th>
                    <th style={{ width: "100px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tripsFollowStatusHistory
                    .filter(
                      (trip) =>
                        trip.statusBusinessTrip !== 0 &&
                        trip.statusBusinessTrip !== 1
                    )
                    .map((trip, index) => (
                      <tr key={index} style={{ color: "black", fontSize: "14px" }}>
                        <td>{index + 1}</td>
                        <td>{getUseNamerById(trip.managerID)}</td>
                        <td>{getPartnerNamerById(trip.partnerID)}</td>
                        <td>{trip.name_trip}</td>
                        <td>{trip.detail_trip}</td>
                        <td>{trip.location_trip}</td>
                        <td>
                          {trip.latitudeTrip} {trip.longitudeTrip}
                        </td>
                        <td>{getDate(trip.time_begin_trip)}</td>
                        <td>{getDate(trip.time_end_trip)}</td>
                        <td>
                          { trip.statusBusinessTrip === 2 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-yellowgreen"
                            >
                              FINISHED
                            </text>
                          ) : trip.statusBusinessTrip === 3 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-green"
                            >
                              COMPLETED
                            </text>
                          ) : trip.statusBusinessTrip === 4 ? (
                            <text
                              style={{ width: "60px" }}
                              className="text-bg-red"
                            >
                              POSTPONED
                            </text>
                          ) : (
                            ""
                          )}
                        </td>
                        <td style={{ width: "100px" }}>
                          {trip.statusBusinessTrip === 0 &&
                            userDetail.id === trip.managerID && (
                              <button
                                className="btn-delete"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you wish to delete this item?"
                                    )
                                  )
                                    deleteTrip(trip.businessTripId);
                                }}
                              >
                                delete
                              </button>
                            )}
                        </td>
                        <td>
                          <Link
                            to={
                              "/tasks/" +
                              trip.businessTripId +
                              "/manager/" +
                              trip.managerID +
                              "/status/" +
                              trip.statusBusinessTrip
                            }
                          >
                            <button
                              style={{ width: "80px" }}
                              className="btn-update"
                            >
                              Tasks
                            </button>
                          </Link>
                        </td>
                        <td >
                          <button
                            style={{ width: "100px" }}
                            className="btn-update"
                            onClick={() => {
                              setBusinessTripIDToGet(trip.businessTripId);
                              getRates(trip.businessTripId); // Make sure it matches the actual property name
                              openShowRate();
                            }}
                          >
                            Conversation 
                          </button>
                        </td>
                        <td>
                          <Link to={"/reports-trip/" + trip.businessTripId}>
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

          {/* add trip */}
          <Modal className="modal" show={showAddTrip} onHide={closeAddTrip}>
            <Modal.Header closeButton>
              <Modal.Title>Add Trip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Manager</Form.Label>
                  <Form.Control
                    type="text"
                    value={getUseNamerById(userDetail.id)}
                    readOnly={true}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Partner</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setTripPost({
                        ...tripPost,
                        partnerID: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={"N"}>--Select--</option>
                    {partners
                      .filter((partner) => partner.status_pn === 1)
                      .map((partner) => (
                        <option
                          key={partner.partnerId}
                          value={partner.partnerId}
                        >
                          {partner.name_pn}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    id="inputName"
                    type="text"
                    placeholder="Name Trip"
                    onChange={(e) =>
                      setTripPost({
                        ...tripPost,
                        name_trip: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Detail</Form.Label>
                  <Form.Control
                    id="inputDetail"
                    type="text"
                    placeholder="Detail Trip"
                    onChange={(e) =>
                      setTripPost({
                        ...tripPost,
                        detail_trip: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    id="inputLocation"
                    type="text"
                    placeholder="Location"
                    onChange={(e) =>
                      setTripPost({
                        ...tripPost,
                        location_trip: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Latitude Trip</Form.Label>
                  <Form.Control
                    id="inputLatitudeTrip"
                    type="Number"
                    placeholder="LatitudeTrip"
                    onChange={(e) =>
                      setTripPost({
                        ...tripPost,
                        latitudeTrip: parseFloat(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Longititude Trip</Form.Label>
                  <Form.Control
                    id="inputLongtitudeTrip"
                    type="Number"
                    placeholder="Longititude Trip"
                    onChange={(e) =>
                      setTripPost({
                        ...tripPost,
                        longitudeTrip: parseFloat(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Time Begin Trip</Form.Label>
                    <DatePicker
                          selected={tripPost.time_begin_trip} 
                          onChange={(date) => {
                            setTripPost({
                              ...tripPost,
                              time_begin_trip: date, 
                            });
                          }}
                          dateFormat="yyyy-MM-dd" 
                          placeholderText="yyyy-mm-dd" 
                      />
                  </Form.Group>
                
                  <Form.Group as={Row} className="mp-3">
                  <Form.Label>Time End Trip</Form.Label>
                    <DatePicker
                          selected={tripPost.time_end_trip} 
                          onChange={(date) => {
                            setTripPost({
                              ...tripPost,
                              time_end_trip: date, 
                            });
                          }}
                          dateFormat="yyyy-MM-dd" 
                          placeholderText="yyyy-mm-dd" 
                      />
                  </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeAddTrip}>
                Close
              </Button>
              <Button variant="primary" onClick={
                createTrip
                }>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* update trip */}
          <Modal
            className="modal"
            show={showUpdateTrip}
            onHide={closeUpdateTrip}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update BusinessTrip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Manager</Form.Label>
                  <Form.Control
                    placeholder={getUseNamerById(tripUpdate.managerID)}
                    readOnly={true}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Partner</Form.Label>
                  <Form.Control
                    placeholder={getPartnerNamerById(tripUpdate.partnerID)}
                    readOnly={true}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    placeholder={tripUpdate.name_trip}
                    readOnly={true}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Detail</Form.Label>
                  <Form.Control
                    placeholder={tripUpdate.detail_trip}
                    readOnly={true}
                  />
                </Form.Group>

                {/* <Form.Group as={Row} className="mp-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    placeholder={tripUpdate.location_trip}
                    readOnly={true}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Time Begin</Form.Label>
                  <Form.Control
                    placeholder={getDate(tripUpdate.time_begin_trip)}
                    readOnly={true}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Time End</Form.Label>
                  <Form.Control
                    placeholder={getDate(tripUpdate.time_end_trip)}
                    readOnly={true}
                  />
                </Form.Group> */}

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setTripUpdate({
                        ...tripUpdate,
                        statusBusinessTrip: e.target.value,
                      })
                    }
                  >
                    <option value="NN">--Select--</option>
                    <option value={4}>POSTPONED</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeUpdateTrip}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateTrip(tripUpdate.businessTripId);
                  closeUpdateTrip();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* view rates */}
          <Modal show={showRate} onHide={closeShowRate}>
            <Modal.Header closeButton>
              <Modal.Title>Conversation </Modal.Title>
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
              <Button variant="secondary" onClick={closeShowRate}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* add rate
          <Modal className="modal" show={showAddRate} onHide={closeAddRate}>
            <Modal.Header closeButton>
              <Modal.Title>Add Rate</Modal.Title>
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
          </Modal> */}
        </div>
      </div>
    </>
  );
};

export default ProductsManagement;
