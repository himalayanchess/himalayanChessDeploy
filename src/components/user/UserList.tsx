import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchIcon from "@mui/icons-material/Search";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";
import ViewUser from "./ViewUser";

const UserList = ({
  role,
  currentPage,
  usersPerPage,
  searchText,
  selectedRole,
  setCurrentPage,
  setFilteredUsersCount,
  activeStatus,
  setActiveStatus,
  newUserAdded,
  setnewUserAdded,
  newCreatedUser,
  setnewCreatedUser,
}) => {
  const [allUsers, setAllUsers] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [userListLoading, setuserListLoading] = useState(true);
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [selectedViewUser, setselectViewUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  // User Delete Function
  async function handleUserDelete(id) {
    try {
      const { data: resData } = await axios.post("/api/users/deleteUser", {
        userId: id,
      });
      let tempAllUsers = [...allUsers];
      tempAllUsers = tempAllUsers.map((user) => {
        if (user._id == id) {
          return { ...user, activeStatus: false };
        } else {
          return user;
        }
      });
      setAllUsers(tempAllUsers);
      handleDeleteModalClose();
      console.log(resData);
    } catch (error) {
      console.log("error in handleUserDelete", error);
    }
  }
  // modal open
  function handleViewModalOpen(user) {
    console.log(user);

    setselectViewUser(user);
    setViewModalOpen(true);
  }
  function handleViewModalClose() {
    setViewModalOpen(false);
  }
  function handleDeleteModalOpen(userId, userName) {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }

  async function getAllUsers() {
    try {
      setuserListLoading(true);
      const { data: resData } = await axios.get("/api/users/getAllUsers");
      // await new Promise((res, rej) => {
      //   setTimeout(() => {
      //     res("asd");
      //   }, 5000);
      // });
      console.log(resData.allUsers);
      setAllUsers(resData.allUsers);
      setuserListLoading(false);
    } catch (error) {
      console.log("error in superadmin/users (getallusers)", error);
    }
  }

  useEffect(() => {
    // add new user
    let tempAllUsers = [...allUsers];

    // Sort users by createdAt in descending order (latest first)
    const sortedUsers = tempAllUsers.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // First, filter by role
    let filteredByRole = sortedUsers.filter(
      (user) => user.role.toLowerCase() === selectedRole.toLowerCase()
    );

    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      filteredByRole = filteredByRole.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply Active Status Filter
    if (activeStatus === "active") {
      filteredByRole = filteredByRole.filter((user) => user.activeStatus);
    } else if (activeStatus === "inactive") {
      filteredByRole = filteredByRole.filter((user) => !user.activeStatus);
    }

    // Update filtered users
    setFilteredUsers(filteredByRole);
    setFilteredUsersCount(filteredByRole.length);
    setCurrentPage(1);
  }, [allUsers, selectedRole, searchText, activeStatus]);
  // Handle new user addition
  useEffect(() => {
    if (newUserAdded && newCreatedUser) {
      setAllUsers((prevUsers) => [newCreatedUser, ...prevUsers]);
      setnewUserAdded(false);
    }
  }, [newUserAdded, newCreatedUser, setnewUserAdded]);
  useEffect(() => {
    if (role) {
      getAllUsers();
    }
  }, [role]);

  return (
    <div className="overflow-x-auto flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings grid grid-cols-5 w-full bg-gray-200">
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Name
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Email
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Gender
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Role
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Actions
        </span>
      </div>

      {/* loading */}
      {userListLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting users</p>
        </div>
      )}
      {/* No Users Found */}
      {filteredUsers.length === 0 && !userListLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No User Found</p>
        </div>
      )}

      {/* Users List */}
      <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
        {filteredUsers
          .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
          .map((member: any) => (
            <div
              key={member?._id}
              className="border-t grid grid-cols-5 items-center hover:bg-gray-50"
            >
              <span className="p-3 text-sm text-gray-700">{member?.name}</span>
              <span className="p-3 text-sm text-gray-700">{member?.email}</span>
              <span className="p-3 text-sm text-gray-700">
                {member?.gender}
              </span>
              <span className="p-3 text-sm text-gray-500">{member?.role}</span>
              <div className="p-3 text-sm text-gray-500">
                {role.toLowerCase() === "superadmin" && (
                  <>
                    {/* view modal */}
                    <button
                      onClick={() => handleViewModalOpen(member)}
                      className="edit mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                    >
                      <WysiwygIcon />
                    </button>
                    <Modal
                      open={viewModalOpen}
                      onClose={handleViewModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      className="flex items-center justify-center"
                      BackdropProps={{
                        style: {
                          backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                        },
                      }}
                    >
                      <Box className="w-[50%] h-[90%] p-6 overflow-y-auto grid grid-cols-2 auto-rows-min grid-auto-flow-dense gap-10 bg-white rounded-xl shadow-lg">
                        <ViewUser user={selectedViewUser} />
                      </Box>
                    </Modal>
                    {/* edit modal */}
                    <button className="edit mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white">
                      <ModeEditIcon />
                    </button>
                    {member?.activeStatus == true && (
                      <button
                        className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                        onClick={() =>
                          handleDeleteModalOpen(member._id, member.name)
                        }
                      >
                        <DeleteIcon />
                      </button>
                    )}
                    <Modal
                      open={deleteModalOpen}
                      onClose={handleDeleteModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      className="flex items-center justify-center"
                      BackdropProps={{
                        style: {
                          backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                        },
                      }}
                    >
                      <Box className="w-96 p-5 border-y-4 border-red-400 flex flex-col items-center bg-white">
                        <DeleteIcon
                          className="text-white bg-red-600 rounded-full"
                          sx={{ fontSize: "3rem", padding: "0.5rem" }}
                        />
                        <p className="text-md mt-1 font-bold ">
                          Delete Account?
                        </p>
                        <span className="text-center mt-2">
                          <span className="font-bold text-xl">
                            {selectedUserName}
                          </span>
                          <br />
                          will be deleted permanently.
                        </span>
                        <div className="buttons mt-5">
                          <Button
                            variant="outlined"
                            sx={{ marginRight: ".5rem", paddingInline: "2rem" }}
                            onClick={handleDeleteModalClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ marginLeft: ".5rem", paddingInline: "2rem" }}
                            onClick={() => handleUserDelete(selectedUserId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Box>
                    </Modal>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserList;
