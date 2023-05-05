import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import "./Students.css";
import * as Realm from "realm-web";
import { Alert, Form, InputGroup, Spinner } from "react-bootstrap";
import Pagination from "./Pagination";
import _ from "lodash";
import { useRef } from "react";
const STable = lazy(() => import("./StudentTable.jsx"));

const dbAPI =
  "https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student";
const appID = "supervisorapp-nlsbq";

const Students = () => {
  const [data, setData] = useState([]);
  const app = Realm.getApp(appID);
  const [accessToken, setAccessToken] = useState(app.currentUser?.accessToken);
  const itemsPerPage = 15;
  const [itemOffset, setItemOffset] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const endOffset = itemOffset + itemsPerPage;
  const [currentItems, setCurrentItems] = useState();
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState();
  const searchRef = useRef();

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken,
  });

  const getData = useCallback(async () => {
    return fetch(dbAPI, {
      method: "GET",
      headers: headers,
    }).then((res) => (res.ok ? res.json() : undefined));
  }, []);

  const handleData = async () => {
    const data1 = await getData();
    if (data1 === undefined) {
      setError("Error loading Data, please logout and login again...   ");
      return;
    }
    setData(data1);
  };

  const handleSearch = (fistName) => {
    if (fistName === "") {
      handleData(data);
    }
    const filtredData = _.filter(
      data,
      (i) =>
        i.first_name.search(fistName) >= 0 ||
        i.last_name.search(fistName) >= 0 ||
        (i.last_name + " " + i.first_name).search(fistName) >= 0 ||
        new Date(i.student_DOB).toLocaleDateString("fr").search(fistName) >= 0
    );

    setCurrentItems(filtredData);
    setPageCount(Math.ceil(filtredData.length / itemsPerPage));
    setSearchValue(fistName);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [data, itemOffset, itemsPerPage]);

  useEffect(() => {
    handleData();
  }, []);

  const BasicSpinner = () => {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-center w-100">
      <div className="mt-4" style={{ minWidth: 1280 }}>
        <div>
          <InputGroup className="mb-4">
            <Form.Control
              style={{ direction: "rtl" }}
              type="text"
              placeholder="بحث عن تلميذ"
              aria-label="بحث عن تلميذ"
              aria-describedby="btnGroupAddon2"
              ref={searchRef}
              onChange={() => handleSearch(searchRef.current.value)}
            />
            <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
          </InputGroup>
        </div>
        <Suspense fallback={<BasicSpinner />}>
          <STable data={currentItems} />
        </Suspense>
        {error && (
          <div className="d-flex justify-content-center m-5">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
        <div className="d-flex justify-content-center my-5">
          {!searchValue && (
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            ></Pagination>
          )}
        </div>
      </div>
    </div>
  );
};
export default Students;
