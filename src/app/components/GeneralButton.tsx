import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import "@fortawesome/fontawesome-svg-core/styles.css";
// fontAwesome doesn't understand strings as the icon name, so we have to import the fontAwesome object
//so the icon imports are in the parent component ex: import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

type GeneralButtonProps = {
  text: string;
  className: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: "submit" | "button" | "reset";
  disabled?: boolean;
  fontAwesome?: IconDefinition;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

//fontAwesome can't just be a string with its name, fontAwesome interally requires an iconDefintion. So you can use an icon map (so the string pulls up the associated icon object value) or pass the icon object directly

const GeneralButton = ({
  text,
  className,
  onClick,
  type,
  disabled,
  fontAwesome,
  onSubmit,
}: GeneralButtonProps) => {
  const isThebuttonDisabled =
    disabled !== undefined ? Boolean(disabled) : false;

  return (
    <button
      className={`  font-bold my-3 py-3 px-4 border-b-4
          shadow-lg shadow-stone-900/70 
      
          hover:bg-white hover:text-100devs hover:border-100devs rounded text-base  disabled:bg-slate-700 disabled:text-white disabled:border-white ${className}`}
      onClick={onClick}
      //onClick recieves MouseEvents not FormEvents, form events should be called on the form (ex: submission)
      type={type}
      disabled={isThebuttonDisabled}
    >
      {text}

      {fontAwesome && (
        <FontAwesomeIcon
          icon={fontAwesome}
          className="text-xl ml-2 translate-y-1"
        />
      )}
    </button>
  );
};

export default GeneralButton;
