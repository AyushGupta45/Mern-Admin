import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [currStatus, setCurrentStatus] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
        } else {
        }
      } catch (error) {}
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser.isAdmin]);

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {}
  };

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table striped className="border">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center border-x-2">
                Date Created
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                User Image
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Username
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Email
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Admin
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Delete
              </Table.HeadCell>
            </Table.Head>

            {users.map((user) => (
              <Table.Body key={user._id} className="divide-y border-b-2">
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="text-center border-x-2">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full m-auto"
                    />
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {user.username}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {user.email}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500 m-auto" />
                    ) : (
                      <FaTimes className="text-red-500 m-auto" />
                    )}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <div>
          <h1 className="text-6xl sm:text-4xl text-center mt-20">
            No users yet
          </h1>
        </div>
      )}

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
              Are you sure you want to delete this user?
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
};

export default DashUsers;
