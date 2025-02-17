const GeneralButton = ({ text, className, onClick, type }) => {
  return (
    <div className="flex">
      <button
        className={`bg-yellow-200 text-100devs font-bold my-3 py-3 px-4 border-b-4 border-yellow-600
          shadow-lg shadow-stone-900/70
          hover:bg-100devs                          hover:text-white                            hover:border-blue-500 rounded text-base ${className}`}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
    </div>
  );
};

export default GeneralButton;
