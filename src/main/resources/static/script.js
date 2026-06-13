const API_URL = "http://localhost:8080/api/employees";

let selectedEmployeeId = null;
let selectedRow = null;
let isUpdateMode = false;

let employeeData = [];


function renderTable(data) {

    const tbody = document.querySelector("#employeeTableBody");
    tbody.innerHTML = "";

    data.forEach((emp, index) => {

        const rowElement = document.createElement("tr");

        rowElement.innerHTML = `
            <td>${index + 1}</td>
            <td>${emp.employeeName || ""}</td>
            <td>${emp.designation || ""}</td>
            <td>${emp.joiningDate || ""}</td>
            <td>${emp.salary || ""}</td>
            <td>${emp.address || ""}</td>
            <td>${emp.mobileNo || ""}</td>
            <td>${emp.gender || ""}</td>
            <td>${emp.city || ""}</td>
            <td>${emp.state || ""}</td>
            <td>${emp.country || ""}</td>
            <td>${emp.employeeType || ""}</td>
        `;

        rowElement.addEventListener("click", () => {

            if (selectedRow) {
                selectedRow.classList.remove("selected-row");
            }

            selectedRow = rowElement;
            selectedEmployeeId = emp.employeeId;

            rowElement.classList.add("selected-row");

            document.getElementById("updateBtn").disabled = false;
            document.getElementById("deleteBtn").disabled = false;
        });

        tbody.appendChild(rowElement);
    });
}


function toggleForm() {
    const modal = document.getElementById("formModal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
}


async function loadEmployees() {
    try
    {
        const res = await fetch(API_URL);
        const data = await res.json();

        employeeData = [...data];
        console.log("DATA:", data);
        renderTable(data);
    }
    catch (err)
    {
        console.error("ERROR:", err);
    }
}

function deleteEmployee(id) {
    fetch(`/delete/${id}`, {
        method: "DELETE"
    })
    .then(() => loadData());  // reload → index auto reset
}


function filterEmployees() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#employeeTableBody tr");

    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();

        if (name.includes(searchValue)) {
            row.style.display = "";
            row.style.backgroundColor = "#fff3cd"; // highlight color
        } else {
            row.style.display = "none";
        }
    });
}


function filterEmployees() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#employeeTableBody tr");

    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();

        if (searchValue === "") {
            row.style.display = "";
            row.style.backgroundColor = "";
        }
        else if (name.includes(searchValue)) {
            row.style.display = "";
            row.style.backgroundColor = "#fff3cd";
        }
        else {
            row.style.display = "none";
        }
    });
}


document.getElementById("employeeForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const employee = {
        employeeName: document.getElementById("employeeName").value,
        designation: document.getElementById("designation").value,
        joiningDate: document.getElementById("joiningDate").value,
        salary: parseFloat(document.getElementById("salary").value),
        address: document.getElementById("address").value,
        mobileNo: document.getElementById("mobileNo").value,
        gender: document.getElementById("gender").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
        employeeType: document.getElementById("employeeType").value
    };

    try {
        let res;

        if (isUpdateMode) {
            // UPDATE API
            res = await fetch(`${API_URL}/${selectedEmployeeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employee)
            });

        } else {
            // ADD API
            res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employee)
            });
        }

        if (!res.ok) {
            throw new Error("Operation failed");
        }

        alert(isUpdateMode ? "Employee Updated" : "Employee Added");

        // Reset
        isUpdateMode = false;
        selectedEmployeeId = null;
        selectedRow = null;

        document.getElementById("employeeForm").reset();
        toggleForm();
        loadEmployees();

    } catch (err) {
        alert("Error: " + err.message);
    }
});

document.getElementById("updateBtn").addEventListener("click", () => {
    if (!selectedEmployeeId) {
        alert("Please select a row first");
        return;
    }

    // Get selected row data
    const cells = selectedRow.children;

    document.getElementById("employeeName").value = cells[1].textContent;
    document.getElementById("designation").value = cells[2].textContent;
    document.getElementById("joiningDate").value = cells[3].textContent;
    document.getElementById("salary").value = cells[4].textContent;
    document.getElementById("address").value = cells[5].textContent;
    document.getElementById("mobileNo").value = cells[6].textContent;
    document.getElementById("gender").value = cells[7].textContent;
    document.getElementById("city").value = cells[8].textContent;
    document.getElementById("state").value = cells[9].textContent;
    document.getElementById("country").value = cells[10].textContent;
    document.getElementById("employeeType").value = cells[11].textContent;

    isUpdateMode = true;

    toggleForm(); // open form
});


document.getElementById("deleteBtn").addEventListener("click", async () => {
    if (!selectedEmployeeId) {
        alert("Please select a row first");
        return;
    }

    const confirmDelete = confirm("Are you sure? Do you want to delete this employee DATA?");

    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API_URL}/${selectedEmployeeId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Delete failed");
        }

        alert("Employee Deleted");

        selectedEmployeeId = null;
        selectedRow = null;

        document.getElementById("updateBtn").disabled = true;
        document.getElementById("deleteBtn").disabled = true;

        loadEmployees();

    } catch (err) {
        alert("Error: " + err.message);
    }
});


document.addEventListener("DOMContentLoaded", loadEmployees);


function sortEmployees() {

    const sortValue =
        document.getElementById("sortOption").value;

    let sortedData = [...employeeData];

    // Sort By Name
    if (sortValue === "name")
    {
        sortedData.sort((a, b) =>
            (a.employeeName || "")
                .localeCompare(b.employeeName || "")
        );
    }

    // Sort By Date
    else if (sortValue === "date")
    {
        sortedData.sort((a, b) =>
            new Date(a.joiningDate) -
            new Date(b.joiningDate)
        );
    }

    // Sort By Salary
    else if (sortValue === "salary")
    {
        sortedData.sort((a, b) =>
            (a.salary || 0) -
            (b.salary || 0)
        );
    }
    // console.log("Sorted Data:", sortedData);

    renderTable(sortedData);
}
// window.onload = loadEmployees;