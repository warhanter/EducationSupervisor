import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import "../styles/Students.css";
import * as Realm from "realm-web";
import { Alert, Form, InputGroup, Spinner } from "react-bootstrap";
import Pagination from "./Pagination";
import _ from "lodash";
import { useRef } from "react";
const STable = lazy(() => import("./StudentTable.jsx"));
const ATable = lazy(() => import("./AbsencesTable.jsx"));
const OTable = lazy(() => import("./MedialLeaveTable.jsx"));
import {
  students,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  absents,
  otlaMaradiya,
} from "../contexts/dbconnect";

const Students = ({ queryTbale }) => {
  const [data, setData] = useState([]);
  const itemsPerPage = 15;
  const [itemOffset1, setItemOffset1] = useState(0);
  const [itemOffset2, setItemOffset2] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  // const endOffset = itemOffset1 + itemsPerPage;
  // const endOffset = itemOffset2 + itemsPerPage;
  const [currentItems, setCurrentItems] = useState();
  const [currentItems2, setCurrentItems2] = useState([]);
  const [currentItems3, setCurrentItems3] = useState([]);
  const [pageCount1, setPageCount1] = useState(0);
  const [pageCount2, setPageCount2] = useState(0);
  const [error, setError] = useState();
  const searchRef = useRef();

  const studentsTablesData =
    queryTbale === "Student"
      ? students
      : queryTbale === "Absence"
      ? absents
      : queryTbale === "nisfdakhil"
      ? nisfDakhili
      : queryTbale === "wafidin"
      ? wafidin
      : queryTbale === "moghadirin"
      ? moghadirin
      : queryTbale === "machtobin"
      ? machtobin
      : queryTbale === "otlaMaradiya"
      ? otlaMaradiya
      : students;

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
    setCurrentItems3(_.filter(data1, (i) => i.absence_date));
  };

  const handleSearch = (fistName) => {
    if (fistName === "") {
      handleData(studentsTablesData);
    }
    const filtredData = _.filter(
      studentsTablesData,
      (i) =>
        i.first_name.search(fistName) >= 0 ||
        i.last_name.search(fistName) >= 0 ||
        (i.last_name + " " + i.first_name).search(fistName) >= 0 ||
        new Date(i.student_DOB).toLocaleDateString("fr").search(fistName) >= 0
    );

    setCurrentItems(filtredData);
    setPageCount1(Math.ceil(filtredData.length / itemsPerPage));
    // if (queryTbale === "Student") {
    // } else {
    //   setCurrentItems2(filtredData);
    //   setPageCount2(Math.ceil(filtredData.length / itemsPerPage));
    // }

    setSearchValue(fistName);
  };

  // useEffect(() => {
  //   const endOffset = itemOffset1 + itemsPerPage;
  //   setCurrentItems(data.slice(itemOffset1, endOffset));
  //   setPageCount1(Math.ceil(data.length / itemsPerPage));
  // }, [data, itemOffset1, itemsPerPage]);

  // useEffect(() => {
  //   const endOffset = itemOffset2 + itemsPerPage;
  //   // setCurrentItems2(currentItems2.slice(itemOffset2, endOffset));
  //   setPageCount2(Math.ceil(currentItems2.length / itemsPerPage));
  // }, [currentItems2, itemOffset2, itemsPerPage]);

  useEffect(() => {
    setCurrentItems(studentsTablesData);
  }, []);
  const BasicSpinner = () => {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  };
  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div className="mt-4 w-100" style={{ maxWidth: 1280 }}>
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
            <ATable />
          </Suspense>
        )}
        {queryTbale === "nisfdakhil" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable data={currentItems} />
          </Suspense>
        )}
        {queryTbale === "wafidin" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable data={currentItems} tableName="wafidin" />
          </Suspense>
        )}
        {queryTbale === "moghadirin" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable data={currentItems} tableName="moghadirin" />
          </Suspense>
        )}
        {queryTbale === "machtobin" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable data={currentItems} tableName="machtobin" />
          </Suspense>
        )}
        {queryTbale === "otlaMaradiya" && (
          <Suspense fallback={<BasicSpinner />}>
            <OTable data={currentItems} />
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
