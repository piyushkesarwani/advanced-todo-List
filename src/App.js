import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./App.css";
import { List } from "./List/List";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function App() {
  const [list, setList] = useState(
    JSON.parse(localStorage.getItem("todoList")) || []
  );
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [sortOrder, setSortOrder] = useState("asc");

  const date = new Date();
  const day = date.getDate(); //8
  const month = date.getMonth() + 1; //1
  const year = date.getFullYear(); //2023
  const todayDate = `${year}-0${month}-0${day}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !desc || !status) {
      //show alert and error if the entry is empty!
      alert("Mandatory fields cannot be empty");
    } else if (title && tags && dueDate && desc && status && isEditing) {
      //handle editing of this section
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return {
              ...item,
              title: title,
              desc: desc,
              tags: tags,
              dueDate: dueDate,
              status: status,
            };
          }
          return item;
        })
      );
      setTitle("");
      setDesc("");
      setTags("");
      setDueDate("");
      setStatus("OPEN");
      setEditId(null);
      setIsEditing(false);
    } else {
      //add the item to the list
      if (dueDate < todayDate) {
        setError(
          "Due Date must be set in the future! Please Provide a valid Due Date to the task."
        );
        return;
      }
      const newItem = {
        id: new Date().toString(),
        title: title,
        desc: desc,
        dueDate: dueDate,
        tags: tags,
        status: status,
      };
      setList([...list, newItem]);
      setTitle("");
      setDesc("");
      setDueDate("");
      setTags("");
      setStatus("OPEN");
      setError("");
      console.log(list);
      // console.log(Date.now().toString());
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
  };

  const deleteItem = (id) => {
    //deleting an existing Item from the list
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    //handling the editing of item in the list
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setTitle(specificItem.title);
    setDesc(specificItem.desc);
    setDueDate(specificItem.dueDate);
    setTags(specificItem.tags);
    setStatus(specificItem.status);
  };

  const clearList = () => {
    setList([]);
  };

  //sort list in Ascending/Descending Order ->
  const sortList = () => {
    const sortedList = [...list];
    sortedList.sort((a, b) => {
      if (sortOrder === "asc") {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      } else {
        //sort the list in descending order
        if (a.title < b.title) return 1;
        if (a.title > b.title) return -1;
        return 0;
      }
    });
    setList(sortedList);
  };

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(list));
  }, [list]);

  return (
    <div className="App">
      <div className="container">
        <div className="text-center fs-1 text-dark">Todo List</div>
        {/* This is the main container  */}
        <div className="mainContainer p-2 border">
          <div className="inputContainer border p-2">
            {error && (
              <>
                <div className="bg-danger text-light text-center p-1 border-danger mb-2">
                  <strong>{error}</strong>
                </div>
              </>
            )}
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              className="d-flex flex-row justify-content-between align-items-center"
            >
              <Form.Group md="4" controlId="validationCustom01">
                <Form.Label className="">
                  Title
                  <span>
                    <OverlayTrigger
                      key="right"
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong>Max 100 characters required</strong>.
                        </Tooltip>
                      }
                    >
                      <Button size="sm" className="ms-2" variant="dark">
                        ?
                      </Button>
                    </OverlayTrigger>
                  </span>
                </Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group md="4" controlId="validationCustom02">
                <Form.Label>
                  Description
                  <span>
                    <OverlayTrigger
                      key="right"
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong>Max 1000 characters required</strong>.
                        </Tooltip>
                      }
                    >
                      <Button size="sm" className="ms-2" variant="dark">
                        ?
                      </Button>
                    </OverlayTrigger>
                  </span>
                </Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  placeholder="Enter Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group md="4" controlId="validationCustomUsername">
                <Form.Label>Due Date:</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="date"
                    aria-describedby="inputGroupPrepend"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a valid Date.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group md="6" controlId="validationCustom03">
                <Form.Label>
                  Tags
                  <span>
                    <OverlayTrigger
                      key="right"
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong>
                            Multiple Tags must be seperated by comma (Case
                            Sensitive)
                          </strong>
                        </Tooltip>
                      }
                    >
                      <Button size="sm" className="ms-2" variant="dark">
                        ?
                      </Button>
                    </OverlayTrigger>
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  placeholder="Your tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                {/* <Form.Control.Feedback type="invalid">
                  Please provide a Tag to task.
                </Form.Control.Feedback> */}
              </Form.Group>
              <Form.Group md="3" controlId="validationCustom04">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>OPEN</option>
                  <option>WORKING</option>
                  <option>DONE</option>
                  <option>OVERDUE</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a valid Status.
                </Form.Control.Feedback>
              </Form.Group>
              {isEditing ? (
                <Button type="submit" className="formBtn">
                  Edit
                </Button>
              ) : (
                <Button type="submit" className="formBtn">
                  Submit
                </Button>
              )}
            </Form>
          </div>
          {list.length > 0 && (
            <div className="border p-2 mt-3 tablelistContainer">
              <div className="d-flex flex-row align-items-center mb-3">
                <div className="fs-3 text-dark">Your List</div>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    placeholder="Enter title to search"
                    className="inputSearch me-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="ms-auto">
                  <label className="fs-5">Total List Items </label>
                  <strong className="fs-5">({list.length})</strong>
                </div>
              </div>
              <List
                list={list}
                deleteItem={deleteItem}
                searchQuery={searchQuery}
                editItem={editItem}
                clearList={clearList}
                sortList={sortList}
                setSortOrder={setSortOrder}
                setList={setList}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
