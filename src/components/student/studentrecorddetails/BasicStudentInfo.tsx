import React, { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import {
  ReceiptText,
  MapPinHouse,
  Contact,
  Crown,
  IdCard,
  SquareArrowDownRight,
  SquareArrowOutUpRight,
} from "lucide-react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { LoadingButton } from "@mui/lab";

import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import { useSession } from "next-auth/react";
import { Avatar, Box, Button, Divider, Modal } from "@mui/material";
import Image from "next/image";
import miles from "@/images/miles.png";
import defaultuser from "@/images/defaultuser.png";
import { notify } from "@/helpers/notify";
import axios from "axios";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicStudentInfo = ({ studentRecord }: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMM D, YYYY");
  };

  const [editProfilePhotoLoading, seteditProfilePhotoLoading] =
    useState<any>(false);
  const [imageFile, setimageFile] = useState<File | any>(null);

  const [selectedImage, setSelectedImage] = useState<any>(
    studentRecord?.imageUrl || defaultuser
  );
  const [originalProfileImage, setoriginalProfileImage] = useState<any>(
    studentRecord?.imageUrl || defaultuser
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
    const folderName = `studentProfileImages/${studentRecord?.branchName}/${studentRecord?.name}`;
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
      notify("Error uploading student profile photo in cloudinary", 204);
      return;
    } else {
      fileUrl = editProfilePhotoResData.res.secure_url;

      const { data: updateStudentResData } = await axios.post(
        "/api/students/updateStudentsProfilePhoto",
        {
          studentId: studentRecord?._id,
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

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-3">
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex col-span-2">
        {/* <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Basic Information</span>
        </p> */}
        <div className="profile-image w-52 h-52 aspect-[1/1] relative mr-10">
          {studentRecord?.affiliatedTo?.toLowerCase() === "hca" ? (
            originalProfileImage ? (
              <Image
                src={originalProfileImage}
                alt="profileimage"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <Image
                src={defaultuser}
                alt="profileimage"
                className="object-cover rounded-full"
              />
            )
          ) : (
            <Avatar
              sx={{ width: 208, height: 208, fontSize: 48 }} // 208px = w-52
            ></Avatar>
          )}
          {studentRecord?.affiliatedTo?.toLowerCase() == "hca" && (
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
        <div className="grid grid-cols-2 w-full gap-2 ">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Name</p>
            <div className="detail flex items-center">
              {/* <PersonOutlineOutlinedIcon sx={{ color: "gray " }} /> */}
              <p className="font-bold ml-1 text-xl">
                {studentRecord?.name || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <div className="detail flex items-center">
              {studentRecord?.gender?.toLowerCase() === "female" ? (
                <FemaleIcon sx={{ color: "gray " }} />
              ) : (
                <MaleIcon sx={{ color: "gray " }} />
              )}
              <p className="font-medium ml-1">
                {studentRecord?.gender || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date of Birth</p>
            <div className="detail flex items-center">
              <EventOutlinedIcon sx={{ color: "gray " }} />
              <p className="font-medium ml-1">
                {studentRecord?.dob ? formatDate(studentRecord?.dob) : "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Joined Date</p>
            <p className="font-medium">
              {studentRecord?.joinedDate
                ? formatDate(studentRecord?.joinedDate)
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">End Date</p>
            <p className="font-medium">
              {studentRecord?.endDate
                ? formatDate(studentRecord?.endDate)
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Affiliated To</p>
            <p className="font-medium">
              {studentRecord?.affiliatedTo || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <div className="detail flex items-center">
              <CallOutlinedIcon sx={{ color: "gray" }} />
              <p className="font-medium ml-1">
                {studentRecord?.phone || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <div className="detail flex items-center">
              <MapPinHouse className="text-gray-500" />
              <p className="font-medium ml-1">
                {studentRecord?.address || "N/A"}
              </p>
            </div>
          </div>
          {studentRecord?.affiliatedTo?.toLowerCase() === "hca" && (
            <div>
              <p className="text-xs text-gray-500">Branch</p>
              <div className="detail flex items-center">
                {studentRecord?.branchName ? (
                  isSuperOrGlobalAdmin ? (
                    <Link
                      href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                        studentRecord?.branchId
                      }`}
                      className="font-medium underline hover:text-blue-500"
                    >
                      {studentRecord?.branchName}
                    </Link>
                  ) : (
                    <span className="text-gray-700 font-medium">
                      {studentRecord?.branchName}
                    </span>
                  )
                ) : (
                  <span className="text-gray-700">N/A</span>
                )}
              </div>
            </div>
          )}

          {studentRecord?.affiliatedTo?.toLowerCase() == "school" &&
            studentRecord?.projectId && (
              <div>
                <p className="text-xs text-gray-500">Project Name</p>
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                    studentRecord?.projectId
                  }`}
                  className="font-medium underline hover:text-blue-500"
                >
                  {studentRecord?.projectName || "N/A"}
                </Link>
              </div>
            )}
        </div>
      </div>

      {/* contact chess information */}
      <div className="contact-chess-information flex flex-col gap-2 col-span-2">
        {/* Contact Information */}
        {/* <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <div className="detail flex items-center">
                <CallOutlinedIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">
                  {studentRecord?.phone || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <div className="detail flex items-center">
                <MapPinHouse className="text-gray-500" />
                <p className="font-medium ml-1">
                  {studentRecord?.address || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div> */}
        {/* Chess Information */}
        <div className="bg-gray-50 flex flex-col rounded-xl p-3 ">
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
                <p className="font-medium ml-1">
                  {studentRecord?.fideId || "N/A"}
                </p>
              </div>
            </div>

            {/* fide id */}
            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <div className="detail flex items-center">
                <StarBorderIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">
                  {studentRecord?.rating || "N/A"}
                </p>
              </div>
            </div>

            {/* fide id */}
            <div>
              <p className="text-xs text-gray-500">Title</p>
              <div className="detail flex items-center">
                <MilitaryTechIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">
                  {studentRecord?.title || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Litches Information */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-2">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          {/* <SupervisorAccountOutlinedIcon /> */}
          <span className="ml-0">Litches Information</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">Litches Username</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.litchesUsername || "N/A"}
              </span>
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Litches URL</p>

            <p className="font-medium flex items-center text-gray-500">
              <SquareArrowOutUpRight size={17} />
              {studentRecord?.litchesUrl ? (
                <Link
                  href={studentRecord?.litchesUrl}
                  target="_blank"
                  className="ml-1 text-blue-600 underline"
                >
                  Litches URL
                </Link>
              ) : (
                <span className="ml-1">N/A</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Guardian information */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-2">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          {/* <SupervisorAccountOutlinedIcon /> */}
          <span className="ml-0">Guardian Information</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">Guardian Name</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.guardianInfo?.name || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Guardian Phone</p>
            <p className="font-medium flex items-center">
              <CallOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.guardianInfo?.phone || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Relation</p>
            <p className="font-medium flex items-center">
              <PersonPinCircleOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.guardianInfo?.relation || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-2">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          <ContactPhoneOutlinedIcon />
          <span className="ml-1">Emergency Contact</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.emergencyContactName || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium flex items-center">
              <CallOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.emergencyContactNo || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Relation</p>
            <p className="font-medium flex items-center">
              <PersonPinCircleOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.emergencyContactRelation || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicStudentInfo;
