import GeneralButton from "./GeneralButton";
import Image from "next/image";

//type alias
type MediaObjectProps = {
  image: string;
  introduction: string;
  listOfText: string[];
  buttonTextLeft?: string;
  buttonTextRight?: string;
  buttonTextLeftLink?: string;
  buttonTextRightLink?: string;
  alttext: string;
  imgwidth: number | string;
  imgheight: number | string;
};

const MediaObjectLeft = ({
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
}: MediaObjectProps) => {
  return (
    <div className="flex justify-center my-6 flex-col md:flex-row sm:ml-2 ">
      <div
        className="self-center 
            shadow-lg shadow-slate-900/70
            border-t-8  border-l-8 border-amber-300 mr-4"
      >
        {/* Typescript requires Image's width and height to be numbers, so convert props to numbers */}
        <Image
          className=""
          src={image}
          width={Number(imgwidth)}
          height={Number(imgheight)}
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
                type="button"
                className="shadow-lg bg-yellow-300 text-blue-950 border-yellow-700"
              />
            </a>
          )}
          {buttonTextRight && (
            <a href={buttonTextRightLink}>
              <GeneralButton
                text={buttonTextRight}
                type="button"
                className="shadow-lg"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
export default MediaObjectLeft;
