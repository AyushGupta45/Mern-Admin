import { Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  HiOutlineExclamationCircle,
  HiMail,
  HiLockClosed,
  HiEyeOff,
  HiEye,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdEdit } from "react-icons/md";

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        toast.error("Could not upload image (File must be less than 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length == 0) {
      toast.error("No changes made");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(updateSuccess(data));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("Failed to Update Profile");
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(deleteUserSuccess(data));
        toast.success("User Deleted Successfully");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("Failed to Delete User");
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        dispatch(signoutSuccess());
        toast.success("Signed Out Successfully");
      }
    } catch (error) {
      toast.error("Failed to Sign Out");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
      <h1 className="text-4xl font-bold text-blue-900 text-center my-4">
        Profile
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-36 h-36 self-center cursor-pointe bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md rounded-full flex justify-center items-center"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && imageFileUploadProgress < 100 ? (
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white">
              <Spinner aria-label="Uploading..." size="xl" />
            </div>
          ) : (
            <>
              <img
                src={
                  imageFileUrl ||
                  currentUser.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt="user"
                className="rounded-full w-32 h-32 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                }}
              />
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
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          addon="@"
        />

        {!currentUser.isAdmin && (
          <div>
            <TextInput
              type="text"
              id="phonenumber"
              placeholder="PhoneNumber"
              defaultValue={currentUser.phonenumber}
              onChange={handleChange}
              addon="+91"
              disabled={currentUser.phonenumber ? true : false}
            />
            {!formData.phonenumber && !currentUser.phonenumber && (
              <span className="text-red-500">
                Please fill in the phone number field.
              </span>
            )}
          </div>
        )}

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          icon={HiMail}
        />
        <div className="relative flex items-center">
          <TextInput
            className="flex-1"
            type={showPassword ? "text" : "password"}
            icon={HiLockClosed}
            placeholder="Password"
            id="password"
            autoComplete="off"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </button>
        </div>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {!currentUser.isAdmin && (
          <Link to={"/upload"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Upload Your Assignment
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
