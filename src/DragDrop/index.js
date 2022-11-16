import update from "immutability-helper";
import { useState, useEffect, useCallback, useRef } from "react";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../App.css";

const type = "DragableBodyRow";

const columns = [
  {
    title: "Name",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Status",
    dataIndex: "subscription",
    key: "status",
    render: (item) => (
      <span
        className={
          Object.values(item)[1] === "Active"
            ? "active"
            : Object.values(item)[1] === "Pending"
              ? "pending"
              : "default-bg"
        }
      >
        {Object.values(item)[1]}
      </span>
    ),
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Credit Card Number",
    dataIndex: "credit_card",
    key: "creditcard",
    render: (item) => <span>{Object.values(item)[0]}</span>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (item) => <span>{Object.values(item)[0]}</span>,
  },
];

const DragDrop = ({ setLength, data, setData }) => {
  const [Value, setValue] = useState("#");
  const [prevSearchData, setPrevSearchData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [size, setSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (event, searchType) => {
    let value = event.target.value;
    
    setValue(value);
    if (prevSearchData === value.length){
      console.log("updated data")
      setData(prevData);
    }
    console.log("Value", value);
    console.log("Data", data);
    let result = [];
    
    result = data.filter((data) => {
      if (searchType === "gender") {
        return data[searchType]?.toLowerCase() === value;
      }
      return data[searchType].toLowerCase().search(value) !== -1;
    });
    console.log("result",result)
    if (result.length === 0) {
      setFilteredData([]);
      setData([]);
    }
    setFilteredData(result);
  };

  const handleStatus = (event) => {
    let value = event.target.value;
    if (Value === ""){
    event.target.value = null;
    }
    console.log("Value",Value)
    setValue(value);
    let result = [];

    result = data.filter((data) => {
      return data.subscription.status?.toLowerCase() === value?.toLowerCase();
    });
    setFilteredData(result);
  };

  const handleSize = (event) => {
    let value = event.target.value;
    setSize(value)
  }


  useEffect(() => {
    if (!filteredData.length) {
      setLength(100)
    }
    else {
      setLength(filteredData.length)
    }
    if (filteredData.length === 0 && data.length !== 0) {
      setPrevData(data);
      console.log("previous",prevData);
    }
    if (filteredData.length !== 0){
      setPrevSearchData(Value.length);
      console.log("prev flag",prevSearchData);
    }

    if (filteredData.length ===0){
      setSearchData(Value.length);
      console.log("prev flag",searchData);
    }
  }, [filteredData, data])

  useEffect(() => {
    if (searchData  == prevSearchData){
      setData(prevData);
    }
  }, [prevSearchData, searchData])

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [data]
  );
  return (
    <div className="container mt-5">
      <div className='filters'>
        <div id="username" className='filter'>
          <p>Username</p>
          <input placeholder='Search...' className="place-holder" type="text" onChange={(event) => handleSearch(event, "first_name")} />
        </div>
        <div id="email" className='filter'>
          <p>Email</p>
          <input placeholder='Search...' type="text" onChange={(event) => handleSearch(event, "email")} />
        </div>
        <div id="count" className='filter'>
          <p>Count</p>
          <input placeholder='10' type="number" onChange={handleSize} />
        </div>
        <div id="gender" className='filter' >
          <p>Gender</p>
          <select onChange={(event) => handleSearch(event, "gender")}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div id="subscription" className='filter'>
          <p>Status</p>
          <select onChange={(event) => handleStatus(event)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="pending">Pending</option>
            <option value="idle">Idle</option>
          </select>
        </div>
      </div>
      <p className='list-items'>Showing 1-10 of 100</p>
      <DndProvider backend={HTML5Backend}>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={filteredData.length ? filteredData : data}
          components={components}
          pagination={{ pageSize: size }}
          onRow={(record, index) => ({
            index,
            moveRow,
          })}
        />
      </DndProvider>

    </div>
  );
};

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop(
    () => ({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName:
            dragIndex < index ? "drop-over-downward" : "drop-over-upward",
        };
      },
      drop: (item) => {
        moveRow(item.index, index);
      },
    }),
    [index]
  );

  const [, drag] = useDrag(
    () => ({
      type,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );

  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
    ></tr>
  );
};



export default DragDrop;
