import { FileInput, Select, TextInput, Button } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import Options from "../components/Options";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Upload = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const handleUploadFile = async () => {
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
        (error) => {
          toast.error("Image upload failed");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadProgress(null);
            setFormData({ ...formData, uploadLink: downloadURL });
            toast.success("File uploaded successfully!");
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
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-blue-100 container w-full mx-auto flex flex-col justify-center items-center py-6 lg:flex-row gap-4">
      <div className="flex-1 w-11/12">
        <img
          src="/assets/350_REpWIE1BUiAxNDctMTI.jpg"
          alt="Home"
          className="w-full h-auto  mix-blend-multiply"
        />
      </div>
      <div className="flex w-full lg:w-5/12 flex-col sm:flex-row gap-4 items-center p-4">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl mb-4 font-bold text-blue-900 text-center my-4">
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
            <Button type="submit" gradientDuoTone="purpleToPink">
              Submit Assignment
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
