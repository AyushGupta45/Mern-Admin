import React, { useRef, useState } from "react";
import { TextInput, Button } from "flowbite-react";
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

const ExpertRegForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    specialization: "",
    uploadLink: "",
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
        setFormData({});
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
            className="relative w-32 h-32 self-center cursor-pointer m-auto shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            <img
              src={
                formData.uploadLink ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="user"
              className={`rounded-full w-full h-full object-cover  border-8 border-[lightgray] ${
                fileUploadProgress && fileUploadProgress < 100 && "opacity-60"
              }`}
            />
          </div>

          <TextInput
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Degree"
            required
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Enter specializations (comma-separated)"
            required
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
