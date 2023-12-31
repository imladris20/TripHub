import { onSnapshot } from "firebase/firestore";
import { find } from "lodash";
import { useEffect, useState } from "react";
import globalStore from "../../store/store";
import { BookMarkIcon } from "../../utils/icons";
import { db } from "../../utils/tripHubDb";

const BookMark = ({ id }) => {
  const { database, uid } = globalStore();
  const [count, setCount] = useState(0);
  const [alreadyIn, setAlreadyIn] = useState([]);

  useEffect(() => {
    if (!database) return;

    let count = 0;
    const containArr = [];

    const unsubscribe = onSnapshot(db.tripsCollection(), (snapshot) => {
      count = 0;
      snapshot.forEach((doc) => {
        if (find(doc.data().attractions, { poisId: id })) {
          count += 1;
          containArr.push(doc.data().name);
        }
      });

      setCount(count);
      setAlreadyIn(containArr);
    });

    return () => unsubscribe();
  }, [database]);

  if (alreadyIn.length <= 0) return;

  return (
    <div className="dropdown dropdown-end dropdown-hover absolute right-2 top-4">
      <div
        tabIndex={0}
        role="button"
        className="flex h-7 w-7 flex-row items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          tabIndex={0}
          role="button"
          viewBox="0 0 24 24"
          className="h-7 w-7 fill-secondary stroke-slate-500 stroke-1"
        >
          <BookMarkIcon />
        </svg>
        <span className="absolute z-10 pb-[3px] text-xs text-slate-500">
          {count}
        </span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] w-32 cursor-default rounded-box bg-gray-200 shadow"
      >
        {alreadyIn.map((item, index) => {
          return (
            <li
              key={index}
              className="flex cursor-default flex-row items-center justify-center border-b-2 border-white px-2 py-1 text-center last:border-none"
            >
              <h4 className="max-w-[120px] cursor-default truncate text-sm text-black">
                {item}
              </h4>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BookMark;
