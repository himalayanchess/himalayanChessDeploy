import Link from "next/link";
import React, { useState } from "react";
import { Avatar, Box, Button, Divider, Modal } from "@mui/material";

import { ReceiptText, MapPinHouse, Contact, Crown, IdCard } from "lucide-react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import { LoadingButton } from "@mui/lab";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import defaultuser from "@/images/defaultuser.png";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import { notify } from "@/helpers/notify";
import axios from "axios";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicUserInformation = ({ userRecord }: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  //modal
  const [editProfilePhotoLoading, seteditProfilePhotoLoading] =
    useState<any>(false);
  const [imageFile, setimageFile] = useState<File | any>(null);

  const [selectedImage, setSelectedImage] = useState<any>(
    userRecord?.imageUrl || defaultuser
  );
  const [originalProfileImage, setoriginalProfileImage] = useState<any>(
    userRecord?.imageUrl || defaultuser
  );
  //modal
  const [updateProfileImageModalOpen, setupdateProfileImageModalOpen] =
    useState(false);

  // modal operation
  function handleupdateProfileImageModalOpen() {
    setupdateProfileImageModalOpen(true);
  }

  function handleupdateProfileImageModalClose(): any {
    setupdateProfileImageModalOpen(false);
    setimageFile(null);
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setSelectedImage(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  //handleEditProfileImage
  async function handleEditProfileImage() {
    // (only for  hca students) in api it is only for hca check
    if (!imageFile) {
      notify("Please select another image", 204);
      return;
    }
    seteditProfilePhotoLoading(true);
    let fileUrl = "";

    // valid different image
    const formData = new FormData();
    formData.append("file", imageFile);
    const folderName = `userProfileImages/${userRecord?.branchName}/${userRecord?.name}`;
    formData.append("folderName", folderName);
    formData.append("cloudinaryFileType", "profileImage");
    const { data: editProfilePhotoResData } = await axios.post(
      "/api/fileupload/uploadfile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // cloudinary error
    if (editProfilePhotoResData.error) {
      notify("Error uploading users profile photo in cloudinary", 204);
      return;
    } else {
      fileUrl = editProfilePhotoResData.res.secure_url;

      const { data: updateStudentResData } = await axios.post(
        "/api/users/updateUsersProfilePhoto",
        {
          userId: userRecord?._id,
          editedProfilePhotoUrl: fileUrl,
        }
      );
      setoriginalProfileImage(fileUrl);
      // no resData.statusCode in cloudinary response
      notify(updateStudentResData?.msg, updateStudentResData?.statusCode);
      handleupdateProfileImageModalClose();
      setSelectedImage(fileUrl || selectedImage);
    }

    seteditProfilePhotoLoading(false);
  }

  // format date
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMM D, YYYY");
  };

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
      {/* Basic Information */}
      <div className="bg-gray-50 col-span-2 flex rounded-xl p-4">
        {/* <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Basic Information</span>
        </p> */}
        <div className="flex gap-4 w-full">
          <div className="profile-image w-52 h-52 aspect-[1/1] relative mr-10">
            <Image
              src={originalProfileImage || defaultuser}
              alt="profile image"
              className="object-cover rounded-full"
              fill
              sizes="208px" // Optional: to avoid warning about `fill`
              priority // Optional: loads image faster
            />
            {session?.data?.user?.role?.toLowerCase() == "superadmin" && (
              <div
                className="absolute top-2 right-1 border cursor-pointer border-gray-300 bg-white px-2 py-1.5 rounded-full hover:bg-gray-200"
                title="Edit photo"
                onClick={handleupdateProfileImageModalOpen}
              >
                <EditIcon />
              </div>
            )}
            {/* update image modal */}
            <Modal
              open={updateProfileImageModalOpen}
              onClose={() => handleupdateProfileImageModalClose()}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="flex items-center justify-center"
            >
              <Box className="w-[400px] p-4 text-center rounded-lg bg-white flex flex-col justify-center items-center">
                <h1 className="text-left  w-full text-xl font-semibold flex items-center">
                  <EditIcon />
                  <span className="ml-2">Update profile image</span>
                </h1>

                <Divider
                  sx={{ margin: ".7rem 0" }}
                  orientation="horizontal"
                  flexItem
                />

                <div className="profile-image w-52 h-52 aspect-[1/1] relative  ">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="updateprofileimage"
                      className="object-cover rounded-full border-2"
                      fill
                    ></Image>
                  ) : (
                    <Image
                      src={defaultuser}
                      alt="updateprofileimage"
                      className="object-cover rounded-full border-2"
                      fill
                    ></Image>
                  )}
                  <label
                    htmlFor="imginput"
                    className="bg-white p-2 rounded-full border cursor-pointer border-gray-300 px-2 py-1.5  absolute bottom-5 right-0 hover:bg-gray-200"
                    title="Upload Photo"
                  >
                    <EditIcon sx={{ fontSize: "1.2rem", color: "gray" }} />
                  </label>
                  <input
                    accept="image/*"
                    onChange={handleFileChange}
                    type="file"
                    id="imginput"
                    name="imginput"
                    className="hidden"
                  />
                </div>

                {editProfilePhotoLoading ? (
                  <LoadingButton
                    loading={editProfilePhotoLoading}
                    loadingPosition="start"
                    variant="contained"
                    sx={{ margin: "1rem 0 .5rem" }}
                    className=" w-full"
                  >
                    <span>Uploading</span>
                  </LoadingButton>
                ) : (
                  <Button
                    sx={{ margin: "1rem 0 .5rem" }}
                    className="w-full"
                    variant="contained"
                    onClick={handleEditProfileImage}
                  >
                    Upload Image
                  </Button>
                )}
              </Box>
            </Modal>
          </div>
          <div className="col-span-1 grid grid-cols-2  w-full">
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Name</p>
              <div className="name-role flex justify-between items-start">
                {/* name */}
                <div className="detail flex items-center">
                  <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
                  <p className="font-bold ml-1 text-xl">
                    {userRecord?.name || "N/A"}
                  </p>
                  <span
                    className={` ml-2 flex items-center gap-2 px-3 py-1 rounded-full text-xs  font-bold 
    ${
      userRecord?.isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full 
      ${userRecord?.isActive ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {userRecord?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* role */}
                <p className="role text-sm bg-gray-200 rounded-full text-gray-600 font-bold px-3 py-0.5">
                  {userRecord?.role || "N/A"}
                </p>
              </div>
              <div className="detail flex items-center">
                <MailOutlineIcon sx={{ color: "gray " }} />
                <p className="ml-1 text-md text-gray-500">
                  {userRecord?.email || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Gender</p>
              <div className="detail flex items-center">
                {userRecord?.gender?.toLowerCase() === "female" ? (
                  <FemaleIcon sx={{ color: "gray " }} />
                ) : (
                  <MaleIcon sx={{ color: "gray " }} />
                )}
                <p className="font-medium ml-1">
                  {userRecord?.gender || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <div className="detail flex items-center">
                <EventOutlinedIcon sx={{ color: "gray " }} />
                <p className="font-medium ml-1">
                  {userRecord?.dob ? formatDate(userRecord?.dob) : "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Joined Date</p>
              <p className="font-medium">
                {userRecord?.joinedDate
                  ? formatDate(userRecord?.joinedDate)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="font-medium">
                {userRecord?.endDate ? formatDate(userRecord?.endDate) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chess Information */}
      <div className="bg-gray-50 flex flex-col col-span-2 rounded-xl p-3">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <Crown />
          <span className="ml-1">Chess Information</span>
        </p>

        {/* fide id */}
        <div className="details grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">FIDE ID</p>
            <div className="detail flex items-center">
              <IdCard className="text-gray-500" />
              <p className="font-medium ml-1">{userRecord?.fideId || "N/A"}</p>
            </div>
          </div>

          {/* fide id */}
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <div className="detail flex items-center">
              <StarBorderIcon sx={{ color: "gray" }} />
              <p className="font-medium ml-1">{userRecord?.rating || "N/A"}</p>
            </div>
          </div>

          {/* fide id */}
          <div>
            <p className="text-xs text-gray-500">Title</p>
            <div className="detail flex items-center">
              <MilitaryTechIcon sx={{ color: "gray" }} />
              <p className="font-medium ml-1">{userRecord?.title || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      {/* Contact Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          {/* <Crown /> */}
          <span className="ml-1">Contact Information</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <div className="detail flex items-center">
              <CallOutlinedIcon sx={{ color: "gray" }} />
              <p className="font-medium ml-1">{userRecord?.phone || "N/A"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <div className="detail flex items-center">
              <MapPinHouse className="text-gray-500" />
              <p className="font-medium ml-1 text-sm">
                {userRecord?.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-1  ">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          {/* <ContactPhoneOutlinedIcon /> */}
          <span className="ml-0">Emergency Contact</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {userRecord?.emergencyContactName || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium flex items-center">
              <CallOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {userRecord?.emergencyContactNo || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* other info */}
      {userRecord?.role?.toLowerCase() != "superadmin" && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
            {/* <Crown /> */}
            <span className="ml-0">Other Information</span>
          </p>

          <div className="details grid grid-cols-2 gap-2">
            {/* branch */}
            <div>
              <p className="text-xs text-gray-500">Branch</p>
              <div className="detail flex items-center">
                <MapPinHouse className="text-gray-500" />
                {userRecord?.branchName ? (
                  isSuperOrGlobalAdmin ? (
                    <Link
                      href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                        userRecord?.branchId
                      }`}
                      className="font-medium ml-1 underline hover:text-blue-500"
                    >
                      {userRecord?.branchName}
                    </Link>
                  ) : (
                    <span className="font-medium ml-1">
                      {userRecord?.branchName}
                    </span>
                  )
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
            {/* CV */}
            {userRecord?.role?.toLowerCase() == "trainer" && (
              <div className="details grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Trainers CV</p>
                  <div className="detail flex items-center">
                    <ArticleOutlinedIcon className="text-gray-500" />
                    {userRecord?.trainerCvUrl ? (
                      <Link
                        href={userRecord?.trainerCvUrl}
                        className="font-medium ml-1 underline hover:text-blue-500"
                      >
                        View CV
                      </Link>
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicUserInformation;
