import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import "../styles/Students.css";
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
  const itemsPerPage = 20;
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [searchData, setSearchData] = useState();
  const [error, setError] = useState();
  const searchRef = useRef();

  const studentsTablesData = () => {
    if (students.length === 0) {
      setError(
        "..... لايمكن الاتصال بقاعدة البيانات، من فضلك قم بتسجيل الخروج وإعادة تسجيل الدخول مرة ثانية"
      );
      return [];
    } else {
      return queryTbale === "Student"
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
        : [];
    }
  };

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % studentsTablesData().length;
    setItemOffset(newOffset);
  };

  const handleSearch = (fistName) => {
    if (fistName === "") {
      setSearchData(undefined);
      setCurrentItems(studentsTablesData());
      setSearchValue(fistName);
      return;
    }
    const filtredData = _.filter(
      studentsTablesData(),
      (i) =>
        i.first_name.search(fistName) >= 0 ||
        i.last_name.search(fistName) >= 0 ||
        (i.last_name + " " + i.first_name).search(fistName) >= 0 ||
        new Date(i.student_DOB).toLocaleDateString("fr").search(fistName) >= 0
    );
    setSearchData(filtredData);
    setPageCount(Math.ceil(filtredData.length / itemsPerPage));
    setSearchValue(fistName);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(studentsTablesData().slice(itemOffset, endOffset));
    setPageCount(Math.ceil(studentsTablesData().length / itemsPerPage));
  }, [currentItems, itemOffset, itemsPerPage]);

  useEffect(() => {
    setCurrentItems(studentsTablesData());
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
            <STable
              data={searchData ? searchData : currentItems}
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {queryTbale === "Absence" && (
          <Suspense fallback={<BasicSpinner />}>
            <ATable
              data={searchData ? searchData : currentItems}
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {queryTbale === "nisfdakhil" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable
              data={searchData ? searchData : currentItems}
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {queryTbale === "wafidin" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable
              data={searchData ? searchData : currentItems}
              tableName="wafidin"
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {queryTbale === "moghadirin" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable
              data={searchData ? searchData : currentItems}
              tableName="moghadirin"
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {queryTbale === "machtobin" && (
          <Suspense fallback={<BasicSpinner />}>
            <STable
              data={searchData ? searchData : currentItems}
              tableName="machtobin"
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {queryTbale === "otlaMaradiya" && (
          <Suspense fallback={<BasicSpinner />}>
            <OTable
              data={searchData ? searchData : currentItems}
              itemOffset={itemOffset}
            />
          </Suspense>
        )}
        {error && (
          <div className="d-flex justify-content-center m-5">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
        <div className="d-flex justify-content-center my-5">
          {!searchValue && queryTbale !== "Absence" && (
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            ></Pagination>
          )}
          {!searchValue && queryTbale === "Absence" && (
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
