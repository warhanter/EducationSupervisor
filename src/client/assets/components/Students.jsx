import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useMemo,
} from "react";
import "../styles/Students.css";
import {
  Alert,
  Button,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import Pagination from "./Pagination";
import { filter, orderBy } from "lodash";
import { useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";
import DatePicker from "react-datepicker";
import { useStudents } from "../../providers/StudentProvider";

const STable = lazy(() => import("./StudentTable.jsx"));
const ATable = lazy(() => import("./AbsencesTable.jsx"));
const OTable = lazy(() => import("./MedialLeaveTable.jsx"));

const Students = ({ queryTbale }) => {
  const {
    motamadrisin,
    wafidin,
    moghadirin,
    machtobin,
    nisfDakhili,
    otlaMaradiya,
    absences,
  } = useStudents();
  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentItems, setCurrentItems] = useState();
  const [rapportDate, setRapportDate] = useState(new Date().setHours(23));
  const [selectedClass, setSelectedClass] = useState();
  const [error, setError] = useState();
  const searchRef = useRef();
  const allClasses = [
    ...new Set(motamadrisin.map((s) => s.full_className)),
  ].sort();

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="btn btn-primary me-4" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const handleSelectClass = useCallback(
    (value) => {
      setSelectedClass(value);
      setCurrentItems(
        studentsTablesData().filter(
          (student) => student.full_className === value
        )
      );
    },
    [currentItems]
  );

  let absenceByDate = useCallback(() => {
    return filter(
      absences,
      (i) =>
        (new Date(i.date_of_return) > rapportDate || !i.date_of_return) &&
        new Date(i.date_of_absence) <= rapportDate
    );
  }, [rapportDate]);
  const allAbsenceClasses = useMemo(
    () => [...new Set(absenceByDate().map((s) => s.full_className))].sort(),
    [rapportDate]
  );
  const studentsTablesData = () => {
    if (motamadrisin?.length === 0 || !motamadrisin) {
      setError(
        "..... لايمكن الاتصال بقاعدة البيانات، من فضلك قم بتسجيل الخروج وإعادة تسجيل الدخول مرة ثانية"
      );
      return [];
    } else {
      return queryTbale === "Student"
        ? motamadrisin
        : queryTbale === "Absence"
        ? orderBy(
            absenceByDate(),
            ["class_level", "class_name", "class_number", "date_of_absence"],
            ["desc"]
          )
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

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(studentsTablesData().slice(itemOffset, endOffset));
    setPageCount(Math.ceil(studentsTablesData().length / itemsPerPage));
  }, [itemOffset, itemsPerPage, rapportDate]);

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
    const filtredData = filter(
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
        return (
          <ATable
            selectedClass={selectedClass}
            data={currentItems}
            itemOffset={itemOffset}
            rapportDate={rapportDate}
            fullDataForCounting={absenceByDate()}
          />
        );
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
          <InputGroup className="mb-4 d-flex flex-row-reverse">
            <div className="me-4">
              <DropdownButton
                dir="ltr"
                variant="primary"
                id="dropdown-basic-button"
                title="الفوج"
              >
                {location.href.includes("absences")
                  ? allAbsenceClasses.map((student) => (
                      <>
                        <Dropdown.Item
                          onClick={(value) =>
                            handleSelectClass(value.currentTarget.innerText)
                          }
                          className="h-100"
                        >
                          {student}
                        </Dropdown.Item>
                      </>
                    ))
                  : allClasses.map((student) => (
                      <Dropdown.Item
                        onClick={(value) =>
                          handleSelectClass(value.currentTarget.innerText)
                        }
                        className="h-100"
                      >
                        {student}
                      </Dropdown.Item>
                    ))}
              </DropdownButton>
            </div>
            {selectedClass && (
              <>
                <div className="me-4">
                  <Button disabled variant="secondary">
                    {selectedClass}
                  </Button>
                </div>
                <div className="me-4">
                  <Button
                    onClick={() => {
                      const endOffset = itemOffset + itemsPerPage;
                      setSelectedClass(null);
                      setCurrentItems(
                        studentsTablesData().slice(itemOffset, endOffset)
                      );
                    }}
                    variant="primary"
                  >
                    الكل
                  </Button>
                </div>
                <div className="me-4">
                  <Button variant="danger">
                    {"التعداد:  " + currentItems?.length}
                  </Button>
                </div>
              </>
            )}
            {/* {currentItems?.length > 10 && (
              
            )} */}
            {queryTbale === "Absence" && (
              <div>
                <DatePicker
                  showIcon
                  selected={rapportDate}
                  onChange={(date) => setRapportDate(date.setHours(23))}
                  customInput={<ExampleCustomInput />}
                />
              </div>
            )}
            <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
            <Form.Control
              style={{ direction: "rtl" }}
              type="text"
              placeholder="بحث عن تلميذ"
              aria-label="بحث عن تلميذ"
              aria-describedby="btnGroupAddon2"
              ref={searchRef}
              onChange={() => handleSearch(searchRef.current.value)}
            />
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
        {!selectedClass ? (
          <div className="d-flex justify-content-center my-5">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        ) : (
          <div className="mt-5"></div>
        )}
      </div>
    </div>
  );
};
export default Students;
