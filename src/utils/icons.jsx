export const CurrentLocationIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-4 w-4 stroke-white stroke-2"
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M256 96V56M256 456v-40"
      />
      <path
        d="M256 112a144 144 0 10144 144 144 144 0 00-144-144z"
        fill="none"
        strokeMiterlimit="10"
        strokeWidth={32}
      />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M416 256h40M56 256h40"
        strokeWidth={32}
      />
    </svg>
  );
};
