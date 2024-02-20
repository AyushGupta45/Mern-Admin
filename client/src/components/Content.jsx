import {
  FileInput,
  Select,
  TextInput,
  Label,
  Button,
  Alert,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import React, { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Options from "./Options";

const Content = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const navigate = useNavigate();

  const handleUploadFile = async () => {
    if (!currentUser) {
      setFileUploadError("You must be logged in");
      navigate("/sign-in");
      return;
    }
    try {
      if (!file) {
        setFileUploadError("Please Upload File");
        return;
      }
      setFileUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError("Image upload failed");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadProgress(null);
            setFileUploadError(null);
            setFormData({ ...formData, uploadLink: downloadURL });
          });
        }
      );
    } catch (error) {
      setFileUploadError("File Upload failed");
      setFileUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await fetch("/api/upload/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setPublishSuccess("Assignment published successfully!");
      }
    } catch (error) {
      setPublishError("Something went wrong!");
    }
  };

  return !currentUser || !currentUser.isAdmin ? (
    <div className="container w-full mx-auto flex flex-col justify-center items-center py-10 lg:flex-row gap-4">
<<<<<<< HEAD
      <div className="flex-1">
        <img
          src="/asset/girl.svg"
=======
      <div>
        <img
          src="/asset/home.svg"
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
          alt="Home"
          className="w-full h-auto md:h-full"
        />
      </div>
<<<<<<< HEAD
      <div className="flex w-full lg:w-5/12 flex-col sm:flex-row gap-4 items-center p-4">
=======
      <div className="flex w-full lg:w-1/2 flex-col sm:flex-row gap-4 items-center p-4">
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7
        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Type your Question"
              required
              id="title"
              className="w-full"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              id="select"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full"
            >
              <Options />
            </Select>
          </div>

          {/* upload*/}
          <div className="flex flex-col gap-4 items-start sm:items-center sm:flex-row sm:justify-between">
            <FileInput
              id="upload"
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadFile}
              disabled={fileUploadProgress}
              className="w-full sm:w-auto"
            >
              {fileUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={fileUploadProgress}
                    text={`${fileUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
          {fileUploadError && <Alert color="failure">{fileUploadError}</Alert>}
          <Button type="submit" gradientDuoTone="purpleToPink">
            Submit Assignment
          </Button>
          {publishSuccess && <Alert color="success">{publishSuccess}</Alert>}
          {publishError && <Alert color="failure">{publishError}</Alert>}
        </form>
      </div>
    </div>
  ) : null;
};

export default Content;
