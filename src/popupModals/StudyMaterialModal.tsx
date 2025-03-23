import { Button, Divider, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { Target } from "lucide-react";
import { notify } from "@/helpers/notify";
import axios from "axios";
import {
  selectTodaysClass,
  updateTodaysClassRecord,
} from "@/redux/trainerSlice";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

const StudyMaterialModal = ({
  studyMaterialModalOpen,
  handleStudyMaterailModalClose,
  selectedTodaysClass,
}: any) => {
  // state variable
  const [uploadStudyMaterialModalOpen, setuploadStudyMaterialModalOpen] =
    useState(false);

  // dispatch
  const dispatch = useDispatch<any>();

  //handleuploadStudyMaterialModalOpen
  function handleuploadStudyMaterialModalOpen() {
    setuploadStudyMaterialModalOpen(true);
  }

  //handleuploadStudyMaterialModalClose
  function handleuploadStudyMaterialModalClose() {
    setuploadStudyMaterialModalOpen(false);
  }

  //handleDeleteStudyMaterial
  async function handleDeleteStudyMaterial(studyMaterial: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/classes/deleteStudyMaterial",
        {
          selectedTodaysClass,
          studyMaterial,
        }
      );
      if (resData?.statusCode == 200) {
        dispatch(selectTodaysClass(resData?.updatedRecord));
        // upadate trainer todaays classes list
        dispatch(updateTodaysClassRecord(resData?.updatedRecord));
      }
      notify(resData?.msg, resData?.statusCode);
    } catch (error) {
      console.log("error in handleDeleteStudyMaterial ", error);
    }
  }

  return (
    <Modal
      open={studyMaterialModalOpen}
      onClose={handleStudyMaterailModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
      BackdropProps={{
        style: { backgroundColor: "rgba(0,0,0,0.4)" },
      }}
    >
      <div className="w-[400px] h-max p-6 rounded-lg shadow-md bg-white">
        {/* header */}
        <div className="header flex justify-between">
          {/* title-button */}
          <div className="title-addButton flex">
            {/* title */}
            <h1 className="text-lg flex items-center font-bold">
              <MenuBookIcon sx={{ fontSize: "1.7rem" }} />
              <span className="ml-2">Study Materials</span>
            </h1>
            {/* add button */}
            <Button
              onClick={handleuploadStudyMaterialModalOpen}
              variant="outlined"
              sx={{ marginLeft: "1rem" }}
            >
              + Add
            </Button>
            {/* uploadStudyMaterialModalOpen */}
            <UploadStudyMaterialModal
              uploadStudyMaterialModalOpen={uploadStudyMaterialModalOpen}
              handleuploadStudyMaterialModalClose={
                handleuploadStudyMaterialModalClose
              }
              selectedTodaysClass={selectedTodaysClass}
            />
          </div>
          {/* close button */}
          <Button
            variant="text"
            color="inherit"
            onClick={handleStudyMaterailModalClose}
          >
            <CloseIcon />
          </Button>
        </div>

        {/* divider */}
        <Divider sx={{ margin: ".7rem 0" }} />

        {/* main body */}
        <div className="mainbody flex flex-col gap-2">
          {/* study materials list */}
          {selectedTodaysClass?.studyMaterials?.filter(
            (studyMaterial: any) => studyMaterial.activeStatus
          )?.length == 0 ? (
            // empty study materials
            <p className="w-max mx-auto my-6 text-gray-500">
              No study materials yet.
            </p>
          ) : (
            selectedTodaysClass?.studyMaterials
              ?.slice() // Creates a shallow copy to avoid mutating the original array
              .filter((studyMaterial: any) => studyMaterial.activeStatus) // Only active ones
              .sort((a: any, b: any) => b.uploadedAt - a.uploadedAt)
              .map((studyMaterial: any) => (
                <div
                  key={studyMaterial?.fileName}
                  className="p-2 flex justify-between items-between bg-gray-100 rounded-md cursor-pointer"
                >
                  {/* title */}
                  <a href={studyMaterial?.fileUrl} className="title">
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: "1.6rem" }} />
                    <span className="ml-2 text-sm">
                      {studyMaterial?.fileName}
                    </span>
                  </a>
                  {/* buttons */}
                  <div className="buttons">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteStudyMaterial(studyMaterial)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StudyMaterialModal;

export const UploadStudyMaterialModal = ({
  uploadStudyMaterialModalOpen,
  handleuploadStudyMaterialModalClose,
  selectedTodaysClass,
}: any) => {
  //state vars
  const [studyMaterialFile, setstudyMaterialFile] = useState<File | any>(null);
  const [fileName, setfileName] = useState("");

  // dispatch
  const dispatch = useDispatch<any>();

  // onSubmit function for upload study material file
  async function onSubmit(e: any) {
    e.preventDefault();
    let fileUrl = "";
    // required fileName
    if (fileName.trim() == "") {
      notify("File name  is required", 204);
      return;
    }
    // check if fileName already exits on studyMaterial list of this class
    const { data: checkFileNameResData } = await axios.post(
      "/api/fileupload/checkStudyMaterialName",
      {
        todaysClassId: selectedTodaysClass?._id,
        fileName,
      }
    );
    // same fileName exists
    if (checkFileNameResData?.statusCode != 200) {
      notify(checkFileNameResData?.msg, checkFileNameResData?.statusCode);
      return;
    }
    // unique file name (ok continue)

    // file required
    if (!studyMaterialFile) {
      notify("Study material file is required", 204);
      return;
    }
    // if file set
    if (studyMaterialFile) {
      const formData = new FormData();
      formData.append("file", studyMaterialFile);
      const extractedDate = dayjs(selectedTodaysClass?.nepaliDate).format(
        "YYYY-MM-DD"
      );
      const folderName = `studymaterials/${extractedDate}/${selectedTodaysClass?.trainerName}`;
      formData.append("folderName", folderName);

      const { data: resData } = await axios.post(
        "/api/fileupload/uploadfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // cloudinary error
      if (resData.error) {
        notify("Error uploading file", 204);
        return;
      }
      // cloudinary success
      else {
        fileUrl = resData.res.secure_url;
        const studyMaterial = {
          fileName,
          fileUrl,
          activeStatus: true,
          uploadedAt: Date.now(),
          fileType: studyMaterialFile?.type.startsWith("image/")
            ? "image"
            : "pdf",
        };
        const { data: addStudyMaterialResData } = await axios.post(
          "/api/classes/addStudyMaterial",
          {
            todaysClassId: selectedTodaysClass?._id,
            studyMaterial,
          }
        );

        // update redux state
        dispatch(
          selectTodaysClass(addStudyMaterialResData?.updatedTodaysClass)
        );
        // upadate trainer todaays classes list
        dispatch(
          updateTodaysClassRecord(addStudyMaterialResData?.updatedTodaysClass)
        );
        notify(
          addStudyMaterialResData?.msg,
          addStudyMaterialResData?.statusCode
        );
        handleuploadStudyMaterialModalClose();
        return;
      }
    }
  }

  // reset file to null when modal close
  useEffect(() => {
    if (!uploadStudyMaterialModalOpen) {
      setstudyMaterialFile(null);
      setfileName("");
    }
  }, [uploadStudyMaterialModalOpen]);
  //handle file change
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      setstudyMaterialFile(file);
    }
  };

  return (
    <Modal
      open={uploadStudyMaterialModalOpen}
      onClose={handleuploadStudyMaterialModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
      BackdropProps={{
        style: { backgroundColor: "rgba(0,0,0,0.4)" },
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-96 h-max p-6 rounded-lg shadow-md bg-white"
      >
        {/* title close */}
        <div className="title-close flex justify-between">
          {/* TITLE */}
          <h1 className="font-bold flex items-center">
            <CloudUploadIcon />
            <span className="ml-2">Upload study material file</span>
          </h1>
          {/* close button */}
          <Button
            variant="text"
            color="inherit"
            onClick={handleuploadStudyMaterialModalClose}
          >
            <CloseIcon />
          </Button>
        </div>
        {/* divider */}
        <Divider sx={{ margin: ".4rem 0" }} />
        {/* inputfield */}
        <TextField
          size="small"
          label="File name"
          className="w-full "
          sx={{ marginTop: "0.9rem" }}
          value={fileName}
          onChange={({ target }) => setfileName(target.value)}
        />
        {/* file input field  */}
        {/* <label htmlFor="studymaterialupload">upload here</label> */}
        <input
          accept="application/pdf,image/*" // allow pdf and image
          onChange={handleFileChange}
          type="file"
          id="studymaterialupload"
          name="contractInput"
          className="mt-4"
        />

        {/* upload button */}
        <Button
          variant="contained"
          className="w-full"
          type="submit"
          sx={{ marginTop: "1.5rem" }}
        >
          Upload
        </Button>
      </form>
    </Modal>
  );
};
