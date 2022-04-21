import { useEffect, useState } from "react";
import { Link } from "raviger";

import { Form } from "../types/custom";

import { useQueryParams } from "raviger";
import { getSubmissions } from "../utils/apiUtils";
import Modal from "../components/common/Modal";
import CreateForm from "../components/CreateForm";
import { Pagination } from "../types/common";

export default function SubmissionsPage(props: { formID: number }) {
  const [state, setState] = useState<Form[]>();
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);
  const [count, setCount] = useState(0);
  const [previous, setPrevious] = useState<string | null>();
  const [next, setNext] = useState<string | null>();

  const listSubmissions = async () => {
    try {
      const data: Pagination<Form> = await getSubmissions(props.formID, {
        offset: 0,
        limit: 5,
      });

      console.log(data);
      console.log(count);

      setState(data.results);
      setCount(data.count);
      setPrevious(data.previous ? data.previous : null);
      setNext(data.next ? data.next : null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    listSubmissions();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 my-4 p-4">
        <div className="flex justify-between  items-center mb-2">
          <h2 className=" text-xl flex-1 font-bold">
            Submissions for Form {props.formID}
          </h2>
        </div>
      </div>
      {count == 0 ? (
        <div className=" flex rounded-lg bg-gray-100 px-8 py-2 m-8 justify-between items-center my-4 p-4 ">
          <p className="text-center text-lg  mx-auto p-8 my-8">
            No submissions found for this form
          </p>
          <Link
            href={`/submission/${props.formID}`}
            className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Share
          </Link>
        </div>
      ) : (
        state &&
        state.map((submission, index) => {
          return (
            <>
              <div className="flex flex-col gap-2 my-4 p-4">
                <div
                  key={submission.id}
                  className="flex flex-col bg-gray-100  rounded-lg p-4  gap-2  text-lg font-semibold"
                >
                  <span className="text-gray-500 text-sm ">
                    {submission.id}
                  </span>

                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <h3 className="">Submission {index + 1}</h3>
                      <p className="text-sm text-gray-500">
                        {/* {form.formFields.length} Questions */}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Link
                        href={`/submissions/${props.formID}/submission/${submission.id}`}
                        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })
      )}
      <div className="flex items-center space-x-1 justify-center">
        <button
          onClick={() => previous}
          className="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md"
        >
          Previous
        </button>

        <button
          onClick={() => listSubmissions()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-700 hover:text-white"
        >
          1
        </button>
        <button
          onClick={() => listSubmissions()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-700 hover:text-white"
        >
          2
        </button>
        <button
          onClick={() => listSubmissions()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-700 hover:text-white"
        >
          3
        </button>
        <button
          onClick={() => next}
          className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-700 hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
