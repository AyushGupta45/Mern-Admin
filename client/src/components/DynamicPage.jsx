import React, { useEffect, useState } from "react";
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
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { subjectsInfo } from "../constants";

const DynamicPage = () => {
  let { subject } = useParams();
  const formattedSubject = subject.replace(/-/g, " ");
  const capitalizedSubject =
    formattedSubject.charAt(0).toUpperCase() + formattedSubject.slice(1);

  const subjectInfo = subjectsInfo.find(
    (sub) => sub.name.toLowerCase() === formattedSubject.toLowerCase()
  );

  const description =
    subjectInfo && subjectInfo.description
      ? subjectInfo.description
      : "Feeling stuck on your assignment? Don't worry, we're here to assist you! Whether it's a tricky problem or a complex project, our team is ready to help. Take the first step towards success by uploading your task now. Our experts will provide tailored assistance to ensure you understand the material and excel in your studies. Don't let challenges hold you back – get the support you need today!";

  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="bg-blue-100 flex justify-center items-center py-8 px-8 lg:px-16">
      <div className="container mx-auto flex flex-col justify-center items-center lg:flex-row gap-x-8">
        <div className="w-full lg:w-1/2 h-auto md:h-full px-4 lg:px-8">
          <div className="flex flex-col justify-center items-center my-10 lg:my-14 w-full">
            <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
              {capitalizedSubject}
            </h1>
            <p className="text-xl text-blue-800 text-start">{description}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-4 lg:p-16 w-full lg:w-1/2">
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 justify-between">
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
                disabled
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full"
              >
                <option value="Biology">{capitalizedSubject}</option>
              </Select>
            </div>
            {/* Upload */}
            <div className="flex flex-col gap-4 items-start sm:items-center sm:flex-row sm:justify-between">
              <FileInput
                id="upload"
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full sm:w-auto"
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
            {fileUploadError && (
              <Alert color="failure">{fileUploadError}</Alert>
            )}
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Submit Assignment
            </Button>
            {publishSuccess && <Alert color="success">{publishSuccess}</Alert>}
            {publishError && <Alert color="failure">{publishError}</Alert>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
