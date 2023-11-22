export const CurrentLocationBtnIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-8 w-8 stroke-slate-700 stroke-2"
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 96V56M256 456v-40"
      />
      <path
        d="M256 112a144 144 0 10144 144 144 144 0 00-144-144z"
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M416 256h40M56 256h40"
        strokeWidth="32"
      />
    </svg>
  );
};

export const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-6 w-6 stroke-yellow-100 stroke-2"
    >
      <path
        d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M338.29 338.29L448 448"
      />
    </svg>
  );
};

export const AddToPoisIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-8 w-8 fill-orange-200 stroke-slate-600 stroke-2"
    >
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 176v160M336 256H176"
      />
    </svg>
  );
};
