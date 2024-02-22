import React, { useEffect, useState, useRef } from "react";
import { Select, TextInput, Button, Spinner } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { academicServices } from "../constants";
import { toast } from "react-hot-toast";
import { IoCloudUpload } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";

const DynamicPageServices = () => {
  const { currentUser } = useSelector((state) => state.user);
  let { service } = useParams();
  const formattedSubject = service.replace(/-/g, " ");
  const capitalizedSubject =
    formattedSubject.charAt(0).toUpperCase() + formattedSubject.slice(1);

  const subjectInfo = academicServices.find(
    (sub) => sub.name.toLowerCase() === formattedSubject.toLowerCase()
  );

  const description =
    subjectInfo && subjectInfo.description
      ? subjectInfo.description
      : "Feeling stuck on your assignment? Don't worry, we're here to assist you! Whether it's a tricky problem or a complex project, our team is ready to help. Take the first step towards success by uploading your task now. Our experts will provide tailored assistance to ensure you understand the material and excel in your studies. Don't let challenges hold you back – get the support you need today!";

  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState({
    uploadLink: "",
    title: "",
    category: capitalizedSubject,
  });
  const navigate = useNavigate();
  const filePickerRef = useRef();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

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
        (error) => {
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
          title: "",
          category: capitalizedSubject,
        });
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <div>
        <img
          src="/assets/785_generated.jpg"
          alt="Home"
          className="w-full md:w-9/12 lg:w-1/2 h-auto mix-blend-multiply m-auto"
        />
      </div>
      <div className="w-full flex justify-center items-center p-4">
        <div className="container mx-auto flex flex-col justify-center items-center lg:flex-row gap-4">
          <div className="w-full lg:w-1/2 h-auto md:h-full">
            <div className="flex flex-col justify-center items-center my-10 lg:my-14 w-full">
              <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
                {capitalizedSubject}
              </h1>
              <p className="text-xl text-blue-800 text-start">{description}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-4 w-full lg:w-1/2">
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4 justify-between">
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
                              <span className="font-semibold">
                                File Uploaded
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            <IoCloudUpload className="mb-4 h-8 w-8 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
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

                <Select id="select" disabled className="w-full">
                  <option value={capitalizedSubject}>
                    {capitalizedSubject}
                  </option>
                </Select>
              </div>

              <Button
                type="submit"
                gradientDuoTone="purpleToPink"
                className="w-full"
              >
                Submit Assignment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPageServices;
