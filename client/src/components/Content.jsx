import { Select, TextInput, Button, Spinner } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Options from "./Options";
import { toast } from "react-hot-toast";
import { IoCloudUpload } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";

const Content = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState({
    uploadLink: "",
    category: "Select a subject",
    title: "",
  });
  const navigate = useNavigate();
  const filePickerRef = useRef();

  const handleUploadFile = async (file) => {
    if (!currentUser) {
      toast.error("You must be logged in");
      navigate("/sign-in");
      return;
    }
    try {
      if (!file) {
        toast.error("Please Upload File");
        return;
      }

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
        () => {
          toast.error("Image upload failed");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadProgress(null);
            setFormData({ ...formData, uploadLink: downloadURL });
            filePickerRef.current.value = '';
          });
        }
      );
    } catch (error) {
      toast.error("File Upload failed");
      setFileUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in");
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
        toast.error(data.message);
        return;
      }
      if (res.ok) {
        toast.success("Assignment published successfully!");
        setFormData({
          uploadLink: "",
          category: "Select a subject",
          title: "",
        });
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return !currentUser || !currentUser.isAdmin ? (
    <div className="container w-full mx-auto flex flex-col justify-center items-center py-6 lg:flex-row gap-4">
      <div className="flex-1 w-11/12">
        <img
          src="/assets/vecteezy_studying-and-learning-online-concept_1270244.svg"
          alt="Home"
          className="w-full h-auto  mix-blend-multiply"
        />
      </div>

      <div className="flex w-full lg:w-5/12 flex-col sm:flex-row gap-4 items-center p-4">
        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Type your Question"
              required
              value={formData.title}
              id="title"
              className="w-full"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <div className="flex w-full items-center justify-center">
              <input
                id="upload"
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) => handleUploadFile(e.target.files[0])}
                ref={filePickerRef}
                hidden
              />
              <div
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-50  pb-6 pt-5"
                onClick={
                  formData.uploadLink !== ""
                    ? null
                    : () => filePickerRef.current.click()
                }
              >
                {fileUploadProgress && fileUploadProgress < 100 ? (
                  <div className="w-32 h-32 flex items-center justify-center rounded-full">
                    <Spinner aria-label="Uploading..." size="xl" />
                  </div>
                ) : (
                  <>
                    {formData.uploadLink !== "" ? (
                      <>
                        <FaCircleCheck className="mb-4 h-8 w-8 text-green-500" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">File Uploaded</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <IoCloudUpload className="mb-4 h-8 w-8 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOC, or DOCX (Maximum file size: 2MB)
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>


            <Select
              id="select"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full"
            >
              <Options />
            </Select>
          </div>

          <Button type="submit" gradientDuoTone="purpleToPink">
            Submit Assignment
          </Button>
        </form>
      </div>
    </div>
  ) : null;
};

export default Content;
