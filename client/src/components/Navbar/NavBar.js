import React from "react";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Link } from "react-router-dom";

function Navbar({ start, end, className, ...delegatedProps }) {
  const [sideBarVisible, setSideBarVisible] = React.useState(false);
  const myStart = (
    <div className="flex gap-2 align-items-center">
      <Button
        tabIndex="-1"
        icon="pi pi-bars"
        severity="secondary"
        text
        onClick={() => setSideBarVisible(true)}
      />
      {start}
    </div>
  );

  const customClassName = className + " pl-2";

  return (
    <div>
      <Toolbar
        start={myStart}
        end={end}
        className={customClassName}
        {...delegatedProps}
      />
      <Sidebar
        header={<h2>Order Manager</h2>}
        visible={sideBarVisible}
        onHide={() => setSideBarVisible(false)}
      >
        <Link to="/">
          <h2 className="m-0">Orders</h2>
        </Link>
        <Link to="/products">
          <h2 className="m-0">Products</h2>
        </Link>
      </Sidebar>
    </div>
  );
}

export default Navbar;
