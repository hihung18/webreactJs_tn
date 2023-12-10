import React from "react";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

const ProductsManagement = () => {
  const hostUsers = process.env.REACT_APP_HOST_USERS;
  const hostReport = process.env.REACT_APP_HOST_REPORTS;
  const hostTrip = process.env.REACT_APP_HOST_TRIPS;

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [reports, setReports] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [trips, setTrips] = React.useState([]);

  let params = useParams();

  React.useEffect(() => {
    fetch(hostReport + params.id, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setReports(res);
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
  }, [hostReport, hostUsers, hostTrip, params.id, userDetail.token]);

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
          <div className="act-top"></div>
          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>STT</th>
                    <th style={{ width: "100px" }}>BusinessTrip</th>
                    <th style={{ width: "120px" }}>User</th>
                    <th style={{ width: "200px" }}>Detail</th>
                    <th style={{ width: "100px" }}>Created At</th>
                    <th style={{ width: "160px" }}></th>

                  </tr>
                </thead>
                <tbody>
                  {reports?.map((report, index) => (
                    <tr key={index}>
                      
                      <td style={{ verticalAlign: 'middle' }}>{index+1}</td>
                      <td style={{ verticalAlign: 'middle' }}>{getTripNameById(report.businessTripID)}</td>
                      <td style={{ verticalAlign: 'middle' }}>{getUseNamerById(report.userID)}</td>
                      <td style={{ verticalAlign: 'middle' }}>{report.report_detail}</td>
                      <td style={{ verticalAlign: 'middle' }}>{getDate(report.time_cre_rp)}</td>
                      <td>
                        {
                          report.imageUrls.map(img => (
                            <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={img}
                              alt="img"
                              style={{
                                height: "120px",
                                width: "120px",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                          ))
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsManagement;
