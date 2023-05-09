import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import "./Students.css";
import * as Realm from "realm-web";
import { Alert, Form, InputGroup, Spinner } from "react-bootstrap";
import Pagination from "./Pagination";
import _ from "lodash";
import { useRef } from "react";
const STable = lazy(() => import("./StudentTable.jsx"));
const ATable = lazy(() => import("./AbsencesTable.jsx"));

// const dbAPI =
//   "https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student";
const appID = "supervisorapp-nlsbq";

const Students = ({ queryTbale }) => {
  const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student`;
  const dbAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Absence`;
  const [data, setData] = useState([]);
  const app = Realm.getApp(appID);
  const [accessToken, setAccessToken] = useState(app.currentUser?.accessToken);
  const itemsPerPage = 15;
  const [itemOffset1, setItemOffset1] = useState(0);
  const [itemOffset2, setItemOffset2] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  // const endOffset = itemOffset1 + itemsPerPage;
  // const endOffset = itemOffset2 + itemsPerPage;
  const [currentItems, setCurrentItems] = useState();
  const [currentItems2, setCurrentItems2] = useState([]);
  const [pageCount1, setPageCount1] = useState(0);
  const [pageCount2, setPageCount2] = useState(0);
  const [error, setError] = useState();
  const searchRef = useRef();

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const handlePageClick1 = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset1(newOffset);
  };
  const handlePageClick2 = (event) => {
    const newOffset = (event.selected * itemsPerPage) % currentItems2.length;
    setItemOffset2(newOffset);
  };

  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken,
  });

  const getDataStudent = useCallback(async () => {
    return fetch(dbAPI, {
      method: "GET",
      headers: headers,
    }).then((res) => (res.ok ? res.json() : undefined));
  }, []);
  const getDataAbsence = useCallback(async () => {
    return fetch(dbAbsences, {
      method: "GET",
      headers: headers,
    }).then((res) => (res.ok ? res.json() : undefined));
  }, []);

  const handleData = async () => {
    const data1 = await getDataStudent();
    const data2 = await getDataAbsence();
    if (data1 === undefined) {
      setError("Error loading Data, please logout and login again...   ");
      return;
    }
    if (data2 === undefined) {
      setError("Error loading Data, please logout and login again...   ");
      return;
    }
    setData(data1);
    setCurrentItems2(data2);
  };

  const handleSearch = (fistName) => {
    const searchData = queryTbale === "Student" ? data : currentItems2;
    if (fistName === "") {
      handleData(searchData);
    }
    const filtredData = _.filter(
      searchData,
      (i) =>
        i.first_name.search(fistName) >= 0 ||
        i.last_name.search(fistName) >= 0 ||
        (i.last_name + " " + i.first_name).search(fistName) >= 0 ||
        new Date(i.student_DOB).toLocaleDateString("fr").search(fistName) >= 0
    );

    if (queryTbale === "Student") {
      setCurrentItems(filtredData);
      setPageCount1(Math.ceil(filtredData.length / itemsPerPage));
    } else {
      setCurrentItems2(filtredData);
      setPageCount2(Math.ceil(filtredData.length / itemsPerPage));
    }

    setSearchValue(fistName);
  };

  useEffect(() => {
    const endOffset = itemOffset1 + itemsPerPage;
    setCurrentItems(data.slice(itemOffset1, endOffset));
    setPageCount1(Math.ceil(data.length / itemsPerPage));
  }, [data, itemOffset1, itemsPerPage]);

  useEffect(() => {
    const endOffset = itemOffset2 + itemsPerPage;
    // setCurrentItems2(currentItems2.slice(itemOffset2, endOffset));
    setPageCount2(Math.ceil(currentItems2.length / itemsPerPage));
  }, [currentItems2, itemOffset2, itemsPerPage]);

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
        {queryTbale === "Student" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable data={currentItems} />
          </Suspense>
        )}
        {queryTbale === "Absence" && (
          <Suspense fallback={<BasicSpinner />}>
            <ATable data={currentItems2} />
          </Suspense>
        )}
        {error && (
          <div className="d-flex justify-content-center m-5">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
        <div className="d-flex justify-content-center my-5">
          {!searchValue && queryTbale === "Student" && (
            <Pagination
              handlePageClick={handlePageClick1}
              pageCount={pageCount1}
            ></Pagination>
          )}
          {!searchValue && queryTbale === "Absence" && (
            <Pagination
              handlePageClick={handlePageClick2}
              pageCount={pageCount2}
            ></Pagination>
          )}
        </div>
      </div>
    </div>
  );
};
export default Students;
