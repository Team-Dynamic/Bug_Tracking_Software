<!DOCTYPE html>
<html>

<head>
  <title>User List</title>
  <meta charset="utf-8" />
  <link rel="icon" type="image/png" href="images/icons/favicon.ico"/>
  <link rel="stylesheet" href="css/user list.css">
</head>

<body>
  <div class="wrapper">

    <div class="top">
      <input type="text" name="search" id="myInput" onkeyup="myFunction()" placeholder="Search..">

      <div class="dropdown">
        <button class="dropbtn">Welcome Admin</button>
        <div class="dropdown-content">
          <a href="/">LogOut</a>
        </div>
      </div>
      <img src="images/logo.png" alt="logo">
    </div>


    <nav class="menu">
      <a href="/busgslist">Bugs</a>
      <a href="/userlist">Manage Users</a>
      <a href="#">Statistics</a>
    </nav>

    <div class="bottom">
      <div class="Manage_User_Options" id="leftbox">
        <li>
          <a target="_top" href="/userlist">User List</a>
        </li>
        <li>
          <a target="_top" href="/adduser">Add User</a>
        </li>
        <li>
          <a target="_top" href="#">Requests</a>
        </li>
      </div>

      <div class="user_list" id="rightbox">
        <div style="overflow-x:auto;">
          <table id="Employee_List" -->
            <thead>
              <tr>
                <th onclick=sortTable(0)>Employee Id</th>
                <th onclick=sortTable(1)>Name of Employee</th>
                <th>Contact No</th>
                <th>Email Id</th>
                <th onclick=sortTable(4)>Role</th>
                <th>Projects Assigned</th>
              </tr>
            </thead>

            <tbody>
            <% userList.forEach(function(details){ %>
              <tr>
                <td><%=details.employee_Id %></td>
                <td><%=details.name %></td>
                <td><%=details.contact %></td>
                <td><%=details.email %></td>
                <td><%=details.role %></td>
                <td><%=details.project_assigned %></td>
              </tr>
          <%  }) %>
            </tbody>

            <tfoot>

            </tfoot>


          </table>
        </div>
      </div>
    </div>

  </div>
  <script src="javascript/user_list.js" charset="utf-8"></script>
</body>
