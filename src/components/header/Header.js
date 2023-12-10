import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [userDetail, setUserDetail] = React.useState(
    JSON.parse(localStorage.getItem("auth"))
  );


  const Signout = () => {
    try {
      localStorage.removeItem("auth");
      setUserDetail({});
      window.location.reload();
      console.log("signout success!");
      console.log(userDetail);
    } catch (e) {
      console.log(e);
    }
  };

  const disableClick = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-2 shop ">
              <h4 className="shop-name">
                {userDetail?.roles[0] === "ROLE_QL" && (
                  <Link className="shop-name" to={"/"}>
                    <div className="hqcorp button type3">HQCorp</div>
                  </Link>
                )}
              </h4>
            </div>

            <div className="col-1 nav-option">
              {userDetail?.roles[0] === "ROLE_QL" && (
                <div className="btn-cont">
                  <a href="/business-trip" className="btn">
                  BUSINESS TRIP
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              )}
            </div>

            <div className="col-1 nav-option">
              {userDetail?.roles[0] === "ROLE_QL" && (
                <div className="btn-cont">
                  <a href="/users" className="btn">
                    USERS
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              )}
            </div>

            <div className="col-1 nav-option">
              {userDetail?.roles[0] === "ROLE_QL" && (
                <div className="btn-cont">
                  <a href="/partners" className="btn">
                    PARTNERS
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              )}
            </div>
            <div className="col-1 btn-auth">
              {!userDetail ? (
                <Link className="button type2" as={Link} to="/login">
                  Sign In
                </Link>
              ) : (
                <Link
                  className="button type2"
                  as={Link}
                  to="/login"
                  onClick={Signout}
                >
                  Sign Out
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <style>
</style>
    </>
  );
};

export default Header;
