import { useState, useEffect } from "react";
import "./styles.css";
import "nouislider/distribute/nouislider.css";


import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Modal from "./Modal";
import DiamondModal from "./DiamondModal";

import Selector from "./form/Selector";
import ValueSlider from "./form/ValueSlider";
import RangeSlider from "./form/RangeSlider";
import DiamondTable from "./DiamondTable";

const color = "D E F G".split(" ");
const clarity = "IF VVS1 VVS2 VS1 VS2".split(" ");
const cut = ["Excellent", "Very Good", "Good"];
const shapes = [
  "Round",
  "Oval",
  "Radiant",
  "Cushion",
  "Marquise",
  "Pear",
  "Emerald",
  "Cushion Miner",
  "Princess",
  "Moval",
  "Heart",
  "Hexagon",
  "Asscher",
  "Triangle",
  "Portugese",
  "Pear Miner",
  "Old Euro",
  "Shield",
  "Trapezoid",
  //"Marquise Brilliant",
  //"?TB?",
];

const diamondHeaders = [
  "Shape",
  "Weight",
  "Color",
  "Clarity",
  "Price",
  "Lab",
  "Cert #",
  "Availability",
  "Video",
];

function weightFilter(row, columnId, filterValue) {
  const high = filterValue[1];
  const low = filterValue[0];
  const rawValue = Number(row.getValue(columnId).toString().replace("ct", ""));
  if (rawValue >= low && rawValue <= high) return true;
  return false;
}

function clarityFilter(row, columnId, filterValue) {
  return filterValue.includes(row.getValue(columnId));
}

function claritySort(a, b, _) {
  const aVal = clarity.indexOf(a.original["Clarity"]);
  const bVal = clarity.indexOf(b.original["Clarity"]);
  if (aVal === bVal) return 0;
  if (aVal < bVal) return -1;
  return 1;
}

function filterDisplay(table, col, end = "", fn = (v) => v) {
  const values = table.getColumn(col).getFilterValue().slice();
  values.splice(1, values.length - 2);
  if (col === "Weight" && values[1] === 99) {
    values[1] = 4;
    end += "+";
  }
  return values.map(fn).join("-") + end;
}

export default function App() {
  const [data, setData] = useState(() => []);
  const [showModal, setShowModal] = useState(false);
  const [currentDiamond, setCurrentDiamond] = useState(null);
  const [columnFilters, setColumnFilters] = useState([
    {
      id: "Shape",
      value: shapes,
    },
    {
      id: "Weight",
      value: [1, 1.2],
    },
    {
      id: "Color",
      value: color,
    },
    {
      id: "Clarity",
      value: clarity,
    },
  ]);
  const [sorting, setSorting] = useState([
    {
      id: "Price",
      desc: false,
    },
  ]);

  useEffect(() => {
    fetch(document.querySelector('#inventory-link').textContent)
      .then((resp) => {
        if (!resp.ok) throw new Error(`Error: ${response.status}`);
        return resp.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const columns = [
    {
      header: "Shape",
      accessorKey: "Shape",
      filterFn: "arrIncludesSome",
      sortingFn: "text",
    },
    {
      header: "Weight",
      accessorKey: "Weight",
      filterFn: weightFilter,
      sortingFn: "alphanumeric",
    },
    {
      header: "Color",
      accessorKey: "Color",
      filterFn: "arrIncludesSome",
      sortingFn: "text",
    },
    {
      header: "Clarity",
      accessorKey: "Clarity",
      filterFn: clarityFilter,
      sortingFn: claritySort,
    },
    {
      header: "Price",
      accessorFn: (row) => `$${row.Price}`,
      sortingFn: "alphanumeric",
    },
    {
      header: "Video",
      accessorKey: "Video",
      cell: ({ row, column }) => (
        <button
          onClick={() => {
            column.columnDef.meta.setShowModal(true);
            column.columnDef.meta.setCurrentDiamond(row.index);
          }}
        >
          Video
        </button>
      ),
      meta: {
        setShowModal,
        setCurrentDiamond,
      },
      enableSorting: false,
    },
  ];

  const getData = (id) => data[id];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return (
    <div className="App">
      <Selector
        id="shape-selector"
        data={shapes}
        setFilter={table.getColumn("Shape").setFilterValue}
      />
      <ValueSlider
        id="carat-slider"
        from={50}
        to={400}
        unit="ct"
        setFilter={table.getColumn("Weight").setFilterValue}
      />
      <div className="range-container">
        <RangeSlider
          id="color-slider"
          data={color}
          setFilter={table.getColumn("Color").setFilterValue}
        />
        <RangeSlider
          id="clarity-slider"
          data={clarity}
          setFilter={table.getColumn("Clarity").setFilterValue}
        />
      </div>
      <span>
        {filterDisplay(table, "Weight", "ct", (v) => v.toFixed(2))} /{" "}
        {filterDisplay(table, "Color")} / {filterDisplay(table, "Clarity")} /{" "}
        {table.getFilteredRowModel().rows.length} diamonds found
      </span>
      {data.length === 0 ? (
        <span>Loading...</span>
      ) : (
        <DiamondTable table={table} sorting={sorting} />
      )}
      <button onClick={() => setShowModal(true)}>show modal</button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        ModalContent={currentDiamond && DiamondModal(currentDiamond, getData)}
      />
    </div>
  );
}
