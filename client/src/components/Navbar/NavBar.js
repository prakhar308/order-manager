import React from "react";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Link } from "react-router-dom";
import { Ripple } from "primereact/Ripple";

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
        <div>
          <ul className="list-none p-3 m-0">
            <li>
              <ul className="list-none p-0 m-0 overflow-hidden">
                <li>
                  <Link
                    to="/"
                    className="no-underline p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-history mr-2"></i>
                    <span className="font-medium">Orders</span>
                    <Ripple />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="no-underline p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-list mr-2"></i>
                    <span className="font-medium">Products</span>
                    <Ripple />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </Sidebar>
    </div>
  );
}

export default Navbar;
