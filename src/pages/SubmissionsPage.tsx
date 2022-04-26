import { useEffect, useState } from "react";
import { Link, navigate } from "raviger";

import { Form } from "../types/custom";
import { getCurrentUser } from "../utils/apiUtils";
import { useQueryParams } from "raviger";
import { getSubmissions } from "../utils/apiUtils";
import Modal from "../components/common/Modal";
import PaginationComponent from "../components/common/Pagination";
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

  const listSubmissions = async (offset: number) => {
    try {
      const data: Pagination<Form> = await getSubmissions(props.formID, {
        offset: offset,
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
    getCurrentUser();
    listSubmissions(0);
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
          <button
            onClick={() => navigate(`/submission/${props.formID}`)}
            className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Share
          </button>
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
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <h3 className="">Submission {submission.id}</h3>
                      <p className="text-sm text-gray-500">
                        {/* {form.formFields.length} Questions */}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/submissions/${props.formID}/submission/${submission.id}`
                          )
                        }
                        className="text-sm bg-blue-500 hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })
      )}
      <PaginationComponent
        count={count}
        listCB={listSubmissions}
        previous={previous}
        next={next}
      />
    </div>
  );
}
