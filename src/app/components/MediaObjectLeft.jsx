import GeneralButton from "./GeneralButton";
import Image from "next/image";

const MediaObject = ({
  image,
  introduction,
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
    <div className="flex justify-center my-6 flex-col md:flex-row sm:ml-2 ">
      <div
        className="self-center 
            shadow-lg shadow-slate-900/70
            border-t-8  border-l-8 border-amber-300 mr-4"
      >
        <Image
          className=""
          src={image}
          width={imgwidth}
          height={imgheight}
          alt={alttext}
          unoptimized
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
      <div
        className="max-w-1/2  mr-8 self-center 
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

        <div className="flex items-center max-w-2xl justify-center ml-4">
          {buttonTextLeft && (
            <a href={buttonTextLeftLink}>
              <GeneralButton
                text={buttonTextLeft}
                className="shadow-lg bg-yellow-300 text-blue-950 border-yellow-700"
              />
            </a>
          )}
          {buttonTextRight && (
            <a href={buttonTextRightLink}>
              <GeneralButton
                text={buttonTextRight}
                className="shadow-lg"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
export default MediaObject;
