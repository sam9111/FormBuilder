import { useEffect, useState } from "react";
import { navigate } from "raviger";

import { Form } from "../types/custom";
import PaginationComponent from "../components/common/Pagination";

import { useQueryParams } from "raviger";
import { getForms, deleteForm, getCurrentUser } from "../utils/apiUtils";
import Modal from "../components/common/Modal";
import CreateForm from "../components/CreateForm";
import { Pagination } from "../types/common";

export default function HomePage() {
  const [state, setState] = useState<Form[]>();
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);
  const [count, setCount] = useState(0);
  const [previous, setPrevious] = useState<string | null>();
  const [next, setNext] = useState<string | null>();

  const listForms = async () => {
    try {
      const data: Pagination<Form> = await getForms({
        offset: 0,
        limit: 5,
      });

      setState(data.results);
      setCount(data.count);
      setPrevious(data.previous ? data.previous : null);
      setNext(data.next ? data.next : null);
    } catch (err) {
      console.log(err);
    }
  };

  const removeForm = async (id: number) => {
    try {
      await deleteForm(id);
      listForms();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrentUser();
    listForms();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 my-4 p-4">
        <div className="flex justify-between  items-center mb-2">
          <h2 className=" text-xl flex-1 font-bold">All Forms</h2>
          <button
            onClick={() => setNewForm(true)}
            className="  text-sm  bg-blue-500 hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Create
          </button>
        </div>
        <div>
          <form
            className=""
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchString });
            }}
          >
            {" "}
            <div className="flex flex-wrap w-full ">
              <input
                className="appearance-none block w-full bg-gray-100   rounded-lg py-3 px-4 leading-tight "
                id="grid-search"
                name="search"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                type="search"
                placeholder="Search"
              />
            </div>
          </form>
          <button
            onClick={() => {
              setSearchString("");
              setQuery("");
            }}
            className=" text-sm bg-blue-500 hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 p-4">
        {state &&
          state
            .filter((form) =>
              form.title.toLowerCase().includes(search?.toLowerCase() || "")
            )
            .map((form) => {
              return (
                <div
                  key={form.id}
                  className="flex flex-col bg-gray-100  rounded-lg p-4  gap-2  text-lg font-semibold"
                >
                  <span className="text-gray-500 text-sm ">{form.id}</span>

                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <h3 className="">{form.title}</h3>
                      <p className="text-sm text-gray-500">
                        {/* {form.formFields.length} Questions */}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/forms/${form.id}`)}
                        className="text-sm bg-blue-500 hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
                      >
                        Open
                      </button>

                      <button
                        onClick={() => form.id && removeForm(form.id)}
                        className="text-sm bg-blue-500 hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateForm />
      </Modal>
      <PaginationComponent
        count={count}
        listCB={listForms}
        previous={previous}
        next={next}
      />
    </div>
  );
}
