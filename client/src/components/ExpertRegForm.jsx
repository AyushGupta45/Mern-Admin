import React, { useRef, useState } from "react";
import { TextInput, Button, Spinner, Label } from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { MdEdit } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const ExpertRegForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    specialization: "",
    uploadLink: "",
    stars: 3,
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

    const specializationsArray = formData.specialization
      .split(",")
      .map((item) => item.trim());

    try {
      const res = await fetch("/api/reg/expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          specialization: specializationsArray,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      if (res.ok) {
        toast.success("Expert Registered successfully!");
        setFormData({
          name: "",
          degree: "",
          specialization: "",
          uploadLink: "",
          stars: 3,
        });
        filePickerRef.current.value = null;
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full bg-blue-100">
      <div className="max-w-lg mx-auto p-3 w-full ">
        <h1 className="text-4xl mb-4 font-bold text-blue-900 text-center my-4">
          Register an Expert
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUploadFile(e.target.files[0])}
            ref={filePickerRef}
            hidden
          />
          <div
            className="relative w-36 h-36 self-center cursor-pointe bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md rounded-full flex justify-center items-center"
            onClick={() => filePickerRef.current.click()}
          >
            {fileUploadProgress && fileUploadProgress < 100 ? (
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white">
                <Spinner aria-label="Uploading..." size="xl" />
              </div>
            ) : (
              <>
                <img
                  src={
                    formData.uploadLink ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="user"
                  className="rounded-full w-32 h-32 object-cover"                />
                <div className="absolute bottom-1.5 right-1.5">
                  <MdEdit
                    className="text-gray-800 bg-white rounded-full p-1 cursor-pointer"
                    size={32}
                  />
                </div>
              </>
            )}
          </div>

          <TextInput
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="flex flex-row gap-4 p-2.5 bg-gray-50 rounded-lg border items-center w-full disabled:cursor-not-allowed disabled:opacity-50  border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 text-sm">
            <Label htmlFor="star" value="Rating" className="text-gray-500" />
            <div className="flex gap-x-4">
              {[1, 2, 3, 4, 5].map((starCount) => (
                <FaStar
                  size={30}
                  key={starCount}
                  id="star"
                  className={`cursor-pointer ${
                    starCount <= formData.stars
                      ? "text-yellow-300"
                      : "text-gray-600"
                  } text-2xl`}
                  onClick={() => setFormData({ ...formData, stars: starCount })}
                />
              ))}
            </div>
          </div>

          <TextInput
            type="text"
            placeholder="Degree"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
          />

          <TextInput
            type="text"
            placeholder="Enter specializations (comma-separated)"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
          />

          <Button type="submit" gradientDuoTone="purpleToPink" className="mb-6">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExpertRegForm;
