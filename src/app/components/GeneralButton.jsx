import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-svg-core/styles.css";
// fontAwesome doesn't understand strings as the icon name, so we have to import the fontAwesome object
//so the icon imports are in the parent component ex: import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const GeneralButton = ({
  text,
  className,
  onClick,
  type,
  disabled,
  fontAwesome,
}) => {
  let isThebuttonDisabled = disabled !== undefined ? Boolean(disabled) : false;

  return (
    <div className="flex">
      <button
        className={`bg-yellow-200 text-100devs font-bold my-3 py-3 px-4 border-b-4 border-yellow-600
          shadow-lg shadow-stone-900/70
          hover:bg-white hover:text-white hover:text-100devs hover:border-100devs rounded text-base ${className} disabled:bg-slate-700 disabled:text-white disabled:border-white`}
        onClick={onClick}
        type={type}
        disabled={isThebuttonDisabled}
      >
        {text}

        {fontAwesome && (
          <FontAwesomeIcon
            icon={fontAwesome}
            className="text-2xl ml-2 translate-y-1"
          />
        )}
      </button>
    </div>
  );
};

export default GeneralButton;
