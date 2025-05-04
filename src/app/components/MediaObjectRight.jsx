import GeneralButton from "./GeneralButton";

import Image from "next/image";

const MediaObjectRight = ({
  introduction,
  image,
  listOfText,
  buttonTextLeft,
  buttonTextRight,
  buttonTextLeftLink,
  buttonTextRightLink,
  alttext,
  imgwidth,
  imgheight,
}) => {
  return (
    <div className="flex justify-center my-6 flex-col md:flex-row sm:ml-2">
      <div
        className="max-w-md ml-4 mr-8 self-center 
    "
      >
        <p className="py-4"> {introduction} </p>
        <ul className="  pb-8 pl-6 text-left border-y-2 p-4 border-white my-2">
          {listOfText.map((sentence) => (
            <li key={sentence}>
              <p> ✅ {sentence} </p>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center  mb-4">
          {buttonTextLeft && (
            <a href={buttonTextLeftLink}>
              <GeneralButton
                text={buttonTextLeft}
                className="shadow-lg bg-yellow-300 text-blue-950 border-yellow-700"
              />
            </a>
          )}

          {buttonTextRight && (
            <a
              className="ml-2"
              href={buttonTextRightLink}
            >
              <GeneralButton
                className="shadow-lg bg-yellow-300 text-blue-950 border-yellow-700"
                text={buttonTextRight}
              />
            </a>
          )}
        </div>
      </div>
      <div
        className="self-center  shadow-xl shadow-slate-900/70
        border-b-8  border-r-8 border-amber-300 ml-4"
      >
        <Image
          className=""
          width={imgwidth}
          height={imgheight}
          src={image}
          alt={alttext}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};
export default MediaObjectRight;
