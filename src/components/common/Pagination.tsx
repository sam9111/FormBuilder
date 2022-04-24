export default function PaginationComponent(props: {
  count: number;
  listCB: any;
  previous?: string | null;
  next?: string | null;
}) {
  const { count, listCB, previous, next } = props;
  const num_pages = Math.ceil(count / 5);
  console.log(num_pages);
  const pages = Array.from(Array(num_pages).keys());
  console.log(pages);

  return (
    <div className="flex items-center space-x-1 justify-center">
      <button
        onClick={() => previous}
        className="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md"
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          onClick={() => listCB(p * 5)}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-700 hover:text-white"
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => next}
        className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-700 hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
