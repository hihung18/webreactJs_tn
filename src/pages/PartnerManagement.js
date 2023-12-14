import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
const UsersManagement = () => {
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const hostPartners = process.env.REACT_APP_HOST_PARTNERS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAdd = () => setShowAdd(false);
  const openAdd = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdate = () => setUpdate(false);
  const openUpdate = () => setUpdate(true);

  const [partners, setPartners] = React.useState([]);
  const [partnerUpdate, setPartnerUpdate] = React.useState({});
  const [partnerPost, setPartnerPost] = React.useState([]);

  React.useEffect(() => {
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
  }, [hostPartners, userDetail.token]);

  const createPartner = async () => {
    console.log(partnerPost);
    const response = await fetch(hostPartners, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name_pn: partnerPost.name_pn,
        email_pn: partnerPost.email_pn,
        phoneNum_pn: partnerPost.phoneNum_pn,
        address_pn: partnerPost.address_pn,
        status_pn: 0,
      }),
    });
    if (!response.ok) {
      alert("Error!");
      closeAdd();
      throw new Error("Error!");
    }
    const res = await response.json();
    console.log(res);

    closeAdd();
    window.location = "/partners";
    alert("Success!");
  };

  // const DeletePartner = async (id) => {
  //   console.log(id);
  //   const response = await fetch(hostPartners + id, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: "Bearer " + userDetail.token,
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to delete user");
  //   }
  //   window.location = "/partners";
  // };

  const UpdatePartner = async (id) => {
    console.log(partnerUpdate);
    const response = await fetch(hostPartners + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partnerId: partnerUpdate.partnerId,
        name_pn: partnerUpdate.name_pn,
        email_pn: partnerUpdate.email_pn,
        phoneNum_pn: partnerUpdate.phoneNum_pn,
        address_pn: partnerUpdate.address_pn,
        status_pn: partnerUpdate.status_pn,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    console.log(data);
    window.location = "/partners";
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAdd} className="btn-add">
              Add Partner
            </Button>
          </div>
          <div className="bg">
            <div className="bg-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr style={{ color: "black", fontSize: "14px" }} >
                    <th style={{ width: "60px" }}>STT</th>
                    <th style={{ width: "250px" }}>Name</th>
                    <th style={{ width: "200px" }}>Email</th>
                    <th >Phone</th>
                    <th style={{ width: "200px" }}>Address</th>
                    <th style={{ width: "150px" }}>Status</th>
                    <th style={{ width: "100px" }}>Update</th>
                    {/* <th>Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                  {partners &&
                    partners.map((partner, index) => (
                      <tr key={partner.partnerId}>
                        <td>{index+1}</td>
                        <td>{partner.name_pn}</td>
                        <td>{partner.email_pn}</td>
                        <td>{partner.phoneNum_pn}</td>
                        <td>{partner.address_pn}</td>
                        <td>
                          {partner.status_pn === 0 
                          ? <text
                                style={{ width: "60px" }}
                                className="text-bg-red"
                              >
                                Hủy hợp tác
                            </text>
                          : <text
                              style={{ width: "60px" }}
                              className="text-bg-green"
                              >
                              Hợp tác
                           </text>
                      }
                        </td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() => {
                              setPartnerUpdate(partner);
                              openUpdate();
                            }}
                          >
                            update
                          </button>
                        </td>
                        {/* <td>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you wish to delete this item?"
                                )
                              )
                                DeletePartner(partner.partnerId);
                            }}
                          >
                            delete
                          </button>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* add partner*/}
      <Modal className="modal" show={showAdd} onHide={closeAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Partner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                id="inputName"
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  setPartnerPost({
                    ...partnerPost,
                    name_pn: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="inputEmail"
                type="text"
                placeholder="Email"
                onChange={(e) =>
                  setPartnerPost({
                    ...partnerPost,
                    email_pn: e.target.value,
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
                  setPartnerPost({
                    ...partnerPost,
                    phoneNum_pn: e.target.value,
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
                  setPartnerPost({
                    ...partnerPost,
                    address_pn: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={createPartner}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update partner*/}
      <Modal show={showUpdate} onHide={closeUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>Update Partner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                id="inputName"
                type="text"
                value={partnerUpdate.name_pn}
                placeholder="Name"
                onChange={(e) =>
                  setPartnerUpdate({
                    ...partnerUpdate,
                    name_pn: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="inputEmail"
                type="text"
                value={partnerUpdate.email_pn}
                placeholder="Email"
                onChange={(e) =>
                  setPartnerUpdate({
                    ...partnerUpdate,
                    email_pn: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                id="inputPhone"
                type="text"
                value={partnerUpdate.phoneNum_pn}
                placeholder="Phone Number"
                onChange={(e) =>
                  setPartnerUpdate({
                    ...partnerUpdate,
                    phoneNum_pn: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                id="inputAddress"
                type="text"
                value={partnerUpdate.address_pn}
                placeholder="Address"
                onChange={(e) =>
                  setPartnerUpdate({
                    ...partnerUpdate,
                    address_pn: e.target.value,
                  })
                }
              />

              <Form.Group as={Row} className="mp-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={partnerUpdate.status_pn}
                  onChange={(e) =>
                    setPartnerUpdate({
                      ...partnerUpdate,
                      status_pn: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={"N"}>--Select--</option>
                  <option value={0}>Huỷ hợp tác</option>
                  <option value={1}>Hợp tác</option>
                </Form.Select>
              </Form.Group>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdate}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdatePartner(partnerUpdate.partnerId);
              closeUpdate();
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
