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
import Options from "../components/Options";
import { useSelector } from "react-redux";

const Upload = () => {
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

  return (
    <div className="bg-blue-100">
      <div className="p-3 max-w-3xl mx-auto">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Post Question
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4  justify-between">
            <TextInput
              type="text"
              placeholder="Type your Question"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              id="select"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
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
              required
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
  );
};

export default Upload;
