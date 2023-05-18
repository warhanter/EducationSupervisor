import React, { Suspense, lazy, useEffect, useState } from "react";
import "../styles/Students.css";
import { Alert, Form, InputGroup, Spinner } from "react-bootstrap";
import Pagination from "./Pagination";
import _ from "lodash";
import { useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

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
  const [currentItems, setCurrentItems] = useState();
  const [error, setError] = useState();
  const searchRef = useRef();

  const studentsTablesData = () => {
    if (students?.length === 0 || !students) {
      setError(
        "..... لايمكن الاتصال بقاعدة البيانات، من فضلك قم بتسجيل الخروج وإعادة تسجيل الدخول مرة ثانية"
      );
      return [];
    } else {
      return queryTbale === "Student"
        ? students
        : queryTbale === "Absence"
        ? absents
        : queryTbale === "nisfdakhili"
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
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(studentsTablesData().slice(itemOffset, endOffset));
      setPageCount(Math.ceil(studentsTablesData().length / itemsPerPage));
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
    setCurrentItems(filtredData);
    setPageCount(1);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(studentsTablesData().slice(itemOffset, endOffset));
    setPageCount(Math.ceil(studentsTablesData().length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  const ViewTable = () => {
    const ViewTableStudents = (tableName) => (
      <STable
        data={currentItems}
        tableName={tableName}
        itemOffset={itemOffset}
      />
    );
    switch (queryTbale) {
      case "Student":
        return ViewTableStudents("Student");
      case "nisfdakhili":
        return ViewTableStudents("nisfdakhili");
      case "wafidin":
        return ViewTableStudents("wafidin");
      case "moghadirin":
        return ViewTableStudents("moghadirin");
      case "machtobin":
        return ViewTableStudents("machtobin");
      case "Absence":
        return <ATable data={currentItems} itemOffset={itemOffset} />;
      case "otlaMaradiya":
        return <OTable data={currentItems} itemOffset={itemOffset} />;
      default:
        break;
    }
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
        <Suspense fallback={<LoadingSpinner />}>
          <ViewTable />
        </Suspense>

        {error && (
          <div className="d-flex justify-content-center m-5">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
        <div className="d-flex justify-content-center my-5">
          <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
        </div>
      </div>
    </div>
  );
};
export default Students;
