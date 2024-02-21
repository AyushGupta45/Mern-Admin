import { FileInput, TextInput, Label, Button } from "flowbite-react";
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
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const UpdateBlogs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState(null);
  const { blogId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `/api/blogs/getblogs?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }
        if (res.ok) {
          const currentblog = data.blogs.filter((blog) => blog._id === blogId);
          setFormData(currentblog[0]);
        }
      };

      fetchPost();
    } catch (error) {
      toast.error(error.message);
    }
  }, [blogId]);

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

    const changesMade =
      formData.title === "" ||
      formData.uploadLink === "" ||
      formData.content === "";

    if (!changesMade) {
      toast.error("No changes made");
      return;
    }

    try {
      const res = await fetch(
        `/api/blogs/updateblog/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      if (res.ok) {
        toast.success("Blog Updated successfully!");
        navigate("/dashboard?tab=blogs");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    formData && (
      <div className="bg-blue-100">
        <div className="p-3 max-w-3xl mx-auto ">
          <h1 className="text-center text-3xl my-7 font-semibold">
            Update Blog
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
                value={formData.title}
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
              value={formData.content}
              theme="snow"
              placeholder="Write Something......"
              className="h-72 mb-12 mt-2 bg-white rounded-lg"
              onChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
            />
            <Button type="submit" gradientDuoTone="purpleToPink">
              Update Blog
            </Button>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateBlogs;
