import React from "react";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

const ProductsManagement = () => {
  const hostUsers = process.env.REACT_APP_HOST_USERS;
  const hostReport = process.env.REACT_APP_HOST_REPORTS_1;
  const hostTask = process.env.REACT_APP_HOST_TASKS;
  const [tasks, setTasks] = React.useState([]);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [reports, setReports] = React.useState([]);
  const [users, setUsers] = React.useState([]);

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
  }, [hostReport, hostUsers, hostTask, params.id, userDetail.token]);

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

  const getTaskNameById = (id) => {
    const result = tasks.find((task) => task.taskId === id);
    console.log(result);
    if (result) {
      return result.nameTask;
    } else {
      return "Unknown";
    }
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top"></div>
          <div className="bg">
            <div className="bg-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr  style={{ color: "black", fontSize: "14px" }}>
                    <th style={{ width: "80px" }}>STT</th>
                    <th style={{ width: "100px" }}>Task Name</th>
                    {/* <th style={{ width: "120px" }}>User</th> */}
                    <th style={{ width: "200px" }}>Detail</th>
                    <th style={{ width: "100px" }}>Created At</th>
                    <th style={{ width: "160px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {reports?.map((report, index) => (
                    <tr key={index}  style={{ color: "black", fontSize: "14px" }}>
                      <td style={{ verticalAlign: "middle" }}>{index + 1}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        {getTaskNameById(report.taskID)}
                      </td>

                      <td style={{ verticalAlign: "middle" }}>
                        {report.report_detail}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {getDate(report.time_cre_rp)}
                      </td>
                      <td>
                        {report.imageUrls.map((img) => (
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
                        ))}
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
