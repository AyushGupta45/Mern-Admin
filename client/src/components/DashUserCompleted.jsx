import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const DashUserCompleted = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userAssignments, setUserAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState("");
  const completedAssignments = userAssignments.filter(
    (assignment) => assignment.isCompleted
  );

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/upload/getassignments");
        const data = await res.json();

        if (res.ok) {
          const filteredAssignments = data.assignments.filter(
            (assignment) =>
              assignment.isCompleted &&
              assignment.userId._id === currentUser._id
          );
          setUserAssignments(filteredAssignments);
        } else {
          toast.error(`Error fetching assignments: ${data.message}`);
        }
      } catch (error) {}
    };

    if (currentUser) {
      fetchAssignments();
    }
  }, [currentUser]);

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {!currentUser.isAdmin && completedAssignments.length > 0 ? (
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
                Status
              </Table.HeadCell>
            </Table.Head>

            {completedAssignments.map((assignment) => (
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
                    <div className="flex justify-center">
                      <div className="flex items-center">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span className="text-green-500">Completed</span>
                      </div>
                    </div>
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
    </div>
  );
};

export default DashUserCompleted;
