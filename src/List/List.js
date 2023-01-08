import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { Tags } from "../Tags/Tags";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export const List = ({
  list,
  deleteItem,
  editItem,
  searchQuery,
  clearList,
  sortList,
  setSortOrder,
  setList,
}) => {
  const date = new Date();
  let day = date.getDate(); //7
  let months = date.getMonth() + 1; //1
  let year = date.getFullYear();
  let pageSize = 5; //the number of list Items needed to be accomodated on a single page.

  let filteredList = [];

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");

  //Code to extract the paginated items from the list
  let paginatedLists = list.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  //code to get the filtered Items from the list based on the status filtering
  const getFilteredLists = () => {
    if (filter === "all") {
      return list;
    }
    return list.filter((item) => item.status === filter);
  };

  return (
    <>
      {/* This the table of list */}
      <div className="listTable">
        <Table striped bordered hover size="lg">
          <thead>
            <tr>
              <th>S.No.</th>
              <th className="d-flex flex-row flex-wrap justify-content-between align-items-center">
                Title{" "}
                <div>
                  <Button
                    size="sm"
                    className="me-2 text-light bg-primary p-1"
                    onClick={() => {
                      setSortOrder("asc");
                      sortList();
                    }}
                  >
                    Sort Ascending
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary p-1"
                    onClick={() => {
                      setSortOrder("desc");
                      sortList();
                    }}
                  >
                    Sort Descending
                  </Button>
                </div>
              </th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Timestamp</th>
              <th>Tags</th>
              <th className="d-flex justify-content-between align-items-center">
                Status
                <div>
                  <Form.Select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      filteredList = getFilteredLists();
                      console.log("filteredList are", filteredList, filter);
                    }}
                    aria-label="Default select example"
                  >
                    <option>all</option>
                    <option>OPEN</option>
                    <option>DONE</option>
                    <option>WORKING</option>
                    <option>OVERDUE</option>
                  </Form.Select>
                  {/* <Button>add</Button> */}
                </div>
              </th>
              <th>Operate</th>
            </tr>
          </thead>
          {paginatedLists
            .filter((item) => {
              return item.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            })
            .map((item, index) => {
              return (
                <tbody key={item.id} className="mt-0">
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{<strong>{item.title}</strong>}</td>
                    <td>{item.desc}</td>
                    <td>{item.dueDate}</td>
                    <td>{`${year}-0${months}-0${day}`}</td>
                    <td>
                      <Tags tags={item.tags} />
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <AiFillEdit
                          className="text-success"
                          onClick={() => editItem(item.id)}
                        />
                        <AiFillDelete
                          className="text-danger"
                          onClick={() =>
                            window.confirm(
                              "Are you sure you want to delete this Item from the List?"
                            )
                              ? deleteItem(item.id)
                              : ""
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </Table>
      </div>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="me-3"
          >
            Prev
          </Button>
          <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          <Button className="ms-2 bg-success">
            currentPage <strong>{currentPage}</strong>
          </Button>
        </div>
        <div>
          <Button variant="danger" className="p-1" onClick={() => clearList()}>
            Clear List
          </Button>
        </div>
      </div>
    </>
  );
};
