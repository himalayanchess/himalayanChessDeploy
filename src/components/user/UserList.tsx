import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import LockIcon from "@mui/icons-material/Lock";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewUser from "./ViewUser";
import AddUser from "./AddUser";
import Link from "next/link";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { deleteUser } from "@/redux/allListSlice";

const UserList = ({
  allFilteredActiveUsersList,
  currentPage,
  usersPerPage,
  allUsersLoading,
  role = "",
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();
  //state vars
  const [loaded, setloaded] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // User Delete Function
  async function handleUserDelete(id: any) {
    try {
      const { data: resData } = await axios.post("/api/users/deleteUser", {
        userId: id,
      });
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteUser(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handleUserDelete", error);
    }
  }

  function handleDeleteModalOpen(userId: any, userName: any) {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }

  useEffect(() => {
    setloaded(true);
  }, []);

  if (!loaded)
    return (
      <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg"></div>
    );

  return (
    <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(6,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Branch
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Gender
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Role
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Active Status
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {allUsersLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting users</p>
        </div>
      )}
      {/* No Users Found */}
      {allFilteredActiveUsersList.length === 0 && !allUsersLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No User Found</p>
        </div>
      )}

      {/* Users List */}
      {!allUsersLoading && (
        <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveUsersList
            .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
            .map((user: any, index: any) => {
              // serial number
              const serialNumber = (currentPage - 1) * usersPerPage + index + 1;
              return (
                <div
                  key={user?._id}
                  className="grid grid-cols-[70px,repeat(6,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    title="View"
                    href={`users/${user?._id}`}
                    className="text-left text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {user?.name}
                  </Link>
                  <span className="text-sm text-gray-700">
                    {user?.branchName || "N/A"}
                  </span>
                  <span className="text-sm text-gray-700">{user?.gender}</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    {user?.role}
                    {user.isGlobalAdmin && (
                      <span className="bg-gray-400 text-xs font-bold  text-white px-2 py-0.5 ml-2 rounded-full">
                        Global
                      </span>
                    )}
                  </span>
                  <span
                    className={` ml-2 w-max flex items-center gap-2 px-3 py-1 rounded-full text-xs  font-bold 
    ${
      user?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full 
      ${user?.isActive ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {user?.isActive ? "Active" : "Inactive"}
                  </span>

                  {role?.toLowerCase() == "superadmin" ? (
                    <div className="text-sm text-gray-500">
                      {/* edit modal */}
                      <Link
                        href={`/superadmin/users/updateuser/${user?._id}`}
                        title="Edit"
                        className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-green-500 hover:text-white"
                      >
                        <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                      </Link>

                      {/* delete modal */}
                      {user?.activeStatus == true && (
                        <button
                          title="Delete"
                          className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                          onClick={() =>
                            handleDeleteModalOpen(user._id, user.name)
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
                              sx={{
                                marginRight: ".5rem",
                                paddingInline: "2rem",
                              }}
                              onClick={handleDeleteModalClose}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{
                                marginLeft: ".5rem",
                                paddingInline: "2rem",
                              }}
                              onClick={() => handleUserDelete(selectedUserId)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Box>
                      </Modal>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      className="w-max h-max"
                      disabled
                    >
                      <LockIcon sx={{ fontSize: "1.2rem" }} />
                      <span className="ml-1">Unauthorized</span>
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UserList;
