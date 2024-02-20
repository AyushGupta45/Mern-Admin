import { Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const DashAdminApproved = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userAssignments, setUserAssignments] = useState([]);
  const completedAssignments = userAssignments.filter(
    (assignment) => !assignment.isCompleted && assignment.isApproved
  );

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(
          `/api/upload/getassignments?userId=${currentUser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setUserAssignments(data.assignments);
        } else {
          console.error(`Error fetching assignments: ${data.message}`);
        }
      } catch (error) {}
    };

    if (currentUser) {
      fetchAssignments();
    }
  }, [currentUser]);

  const handleComplete = async (assignmentId, userId) => {
    try {
      const res = await fetch(
        `/api/upload/completed/${assignmentId}/user/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted: true }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === assignmentId
              ? { ...assignment, isCompleted: true }
              : assignment
          )
        );
      } else {
        console.error(`Error updating completion status: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {currentUser.isAdmin && completedAssignments.length > 0 ? (
        <>
          <Table striped className="border">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center border-x-2">
                Date Uploaded
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Title
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Category
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Complete
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
                  <Table.Cell className="font-medium text-gray-900 dark:text-white text-center border-x-2">
                    {assignment.title}
                  </Table.Cell>
                  <Table.Cell className="text-center border-x-2">
                    {assignment.category}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <div className="flex justify-center">
                      {assignment.isApproved && !assignment.isCompleted && (
                        <>
                          <Button
                            outline
                            className="bg-green-500 hover:bg-green-700 text-white w-20"
                            onClick={() =>
                              handleComplete(
                                assignment._id,
                                assignment.userId._id
                              )
                            }
                          >
                            Complete
                          </Button>
                        </>
                      )}

                      {assignment.isCompleted && (
                        <div className="flex items-center">
                          <IoCheckmarkCircleOutline className="text-green-500" />
                          <span className="text-green-500">Completed</span>
                        </div>
                      )}
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
            No assignments approved yet
          </h1>
        </div>
      )}
    </div>
  );
};

export default DashAdminApproved;
