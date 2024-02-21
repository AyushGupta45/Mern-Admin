import {
  FileInput,
  TextInput,
  Label,
  Button,
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const CreateBlogs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

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
        () => {
          toast.error("Image upload failed");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadProgress(null);
            setFormData({ ...formData, uploadLink: downloadURL });
            toast.success("Image uploaded successfully!");
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
      const res = await fetch("/api/blogs/create-blog", {
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
        toast.success("Blog Created successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-blue-100">
      <div className="p-3 max-w-3xl mx-auto ">
        <h1 className="text-4xl mb-4 font-bold text-blue-900 text-center my-4">
          Create a Blog
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4  justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="upload" className="block mb-2 text-lg font-bold">
              Add Images:
            </Label>
            <div className="flex flex-col gap-4 items-start sm:items-center sm:flex-row sm:justify-between">
              <FileInput
                id="upload"
                type="file"
                accept="image/*"
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
          </div>
          {formData && formData.uploadLink && (
            <div className="border border-gray-300 rounded-md p-4 mt-2 bg-white">
              <img
                src={formData.uploadLink}
                alt="upload"
                className="w-full h-72 object-contain"
              />
            </div>
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write Something......"
            className="h-72 mb-12 mt-2 bg-white rounded-lg"
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Create Blog
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogs;
