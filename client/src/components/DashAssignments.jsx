import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const DashAssignments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userAssignments, setUserAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState("");
  const Assignments = userAssignments.filter(
    (assignment) => !assignment.isApproved && !assignment.isDenied
  );

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/upload/getassignments");
        const data = await res.json();

        if (res.ok) {
          setUserAssignments(data.assignments);
        } else {
          toast.error(`Error fetching assignments: ${data.message}`);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchAssignments();
    }
  }, [currentUser.isAdmin]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/upload/delete/${assignmentIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
      } else {
        setUserAssignments((prev) =>
          prev.filter((post) => post._id !== assignmentIdToDelete)
        );
      }
    } catch (error) {}
  };

  const handleApprove = async (assignmentId, userId) => {
    try {
      const res = await fetch(
        `/api/upload/updateapproval/${assignmentId}/user/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: true }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === assignmentId
              ? { ...assignment, isApproved: true }
              : assignment
          )
        );
      } else {
        toast.error(`Error updating approval status: ${data.message}`);
      }
    } catch (error) {
      toast.error("Error updating approval status:", error);
    }
  };

  const handleDeny = async (assignmentId, userId) => {
    try {
      const res = await fetch(
        `/api/upload/denyapproval/${assignmentId}/user/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isDenied: true }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === assignmentId
              ? { ...assignment, isDenied: true }
              : assignment
          )
        );
      } else {
        toast.error(`Error updating denial status: ${data.message}`);
      }
    } catch (error) {
      toast.error("Error updating denial status:", error);
    }
  };

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {currentUser.isAdmin && Assignments.length > 0 ? (
        <>
          <Table striped className="border">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center border-x-2">
                Date Uploaded
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                User
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Title
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Category
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                View
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Action
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Delete
              </Table.HeadCell>
            </Table.Head>

            {Assignments.map((assignment) => (
              <Table.Body key={assignment._id} className="divide-y border-b-2">
                <Table.Row
                  key={assignment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="text-center border-x-2">
                    {new Date(assignment.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-center border-x-2">
                    {assignment.userId.email}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white text-center">
                    {assignment.title}
                  </Table.Cell>
                  <Table.Cell className="text-center border-x-2">
                    {assignment.category}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <Button
                      outline
                      className="bg-blue-500 hover:bg-blue-700 text-white m-auto"
                      onClick={() =>
                        window.open(assignment.uploadLink, "_blank")
                      }
                    >
                      View
                    </Button>
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <div className="flex justify-center gap-2">
                      {!assignment.isApproved && !assignment.isDenied && (
                        <>
                          <Button
                            outline
                            className="bg-green-500 hover:bg-green-700 text-white w-20"
                            onClick={() =>
                              handleApprove(
                                assignment._id,
                                assignment.userId._id
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            outline
                            className="bg-red-500 hover:bg-red-700 text-white w-20"
                            onClick={() =>
                              handleDeny(assignment._id, assignment.userId._id)
                            }
                          >
                            Deny
                          </Button>
                        </>
                      )}

                      {assignment.isApproved && (
                        <div className="flex items-center">
                          <IoCheckmarkCircleOutline className="text-green-500" />
                          <span className="text-green-500">Approved</span>
                        </div>
                      )}

                      {assignment.isDenied && (
                        <div className="flex items-center">
                          <IoCloseCircleOutline className="text-red-500" />
                          <span className="text-red-500">Denied</span>
                        </div>
                      )}
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-red-500 font-medium hover:underline cursor-pointer text-center">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setAssignmentIdToDelete(assignment._id);
                      }}
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
            No assignments recieved yet
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashAssignments;
