import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const DashExperts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [experts, setExperts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expertIdToDelete, setExpertIdToDelete] = useState("");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch("/api/reg/getexperts");
        const data = await res.json();

        if (res.ok) {
          setExperts(data.experts);
        } else {
          toast.error("error fetching");
        }
      } catch (e) {
        toast.error("Error fetching experts:", e.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchExperts();
    }
  }, [currentUser.isAdmin]);

  const handleDelete = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/reg/delexperts/${expertIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        setExperts((prev) =>
          prev.filter((expert) => expert._id !== expertIdToDelete)
        );
        toast.success("Expert deleted successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {currentUser.isAdmin && experts.length > 0 ? (
        <>
          <Table striped className="border">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center border-x-2">
                Date Created
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Profile
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Name
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Rating
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Degree
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Specialization
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Delete
              </Table.HeadCell>
            </Table.Head>

            {experts.map((expert) => (
              <Table.Body key={expert._id} className="divide-y border-b-2">
                <Table.Row
                  key={expert._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="text-center border-x-2">
                    {new Date(expert.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <img
                      src={
                        expert.uploadLink ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      alt={expert.name}
                      className="w-8 h-8 object-cover rounded-full m-auto"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                      }}
                    />
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {expert.name}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <div className="flex justify-center items-center text-yellow-400 gap-x-1">
                      {[...Array(expert.stars || 0)].map((_, index) => (
                        <FaStar key={index} size={15} />
                      ))}
                      {expert.stars === undefined && (
                        <span>No rating available</span>
                      )}
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {expert.degree}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {expert.specialization.join(", ")}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setExpertIdToDelete(expert._id);
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
              <Button color="failure" onClick={handleDelete}>
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

export default DashExperts;
