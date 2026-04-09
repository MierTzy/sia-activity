// Update these values if you want the first row to match your exact details.
const personalInfo = {
  id: "005110",
  firstName: "Jemaica",
  lastName: "Ngujo",
  username: "jemaica.ngujo",
  email: "your-email@example.com",
  zipcode: "7200"
};

const tableBody = document.getElementById("userTableBody");
const statusMessage = document.getElementById("statusMessage");
const reloadButton = document.getElementById("reloadButton");

function formatId(value) {
  return String(value).padStart(6, "0");
}

function splitName(fullName) {
  const trimmedName = fullName.trim();
  const parts = trimmedName.split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ") || "-";

  return { firstName, lastName };
}

function createRow(user) {
  return `
    <tr>
      <td>${user.id}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.zipcode}</td>
    </tr>
  `;
}

function normalizeApiUser(user) {
  const { firstName, lastName } = splitName(user.name);

  return {
    id: formatId(user.id),
    firstName,
    lastName,
    username: user.username,
    email: user.email,
    zipcode: user.address.zipcode
  };
}

async function loadUsers() {
  statusMessage.textContent = "Loading data...";
  reloadButton.disabled = true;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const apiUsers = await response.json();
    const rows = [personalInfo, ...apiUsers.map(normalizeApiUser)];

    tableBody.innerHTML = rows.map(createRow).join("");
    statusMessage.textContent = `Loaded ${rows.length} rows successfully.`;
  } catch (error) {
    tableBody.innerHTML = createRow({
      id: "-",
      firstName: "Unable",
      lastName: "to load",
      username: "error",
      email: "check-connection",
      zipcode: "n/a"
    });
    statusMessage.textContent = `Could not fetch API data: ${error.message}`;
  } finally {
    reloadButton.disabled = false;
  }
}

reloadButton.addEventListener("click", loadUsers);
loadUsers();
