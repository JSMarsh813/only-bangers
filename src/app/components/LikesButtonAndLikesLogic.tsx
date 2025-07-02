import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { useUser } from "./context-wrappers/UserInfo";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

type LikesButtonAndLikesLogicType = {
  data: PostType;
  apiLink: string;
  HeartIconStyling?: string;
  HeartIconTextStyling?: string;
};
export default function LikesButtonAndLikesLogic({
  data,
  apiLink,
  HeartIconStyling,
  HeartIconTextStyling,
}: LikesButtonAndLikesLogicType) {
  const { currentUsersInfo, ...other } = useUser();
  const userId = currentUsersInfo?.$id ? currentUsersInfo.$id : "guest";

  const [likesCount, setLikesCount] = useState<number>(
    data.liked_by_users_length ?? data.liked_by_users_length,
  );
  // Instead of this ternary:
  // data.liked_by_users_length == null ? 0 : data.liked_by_users_length,

  //we can simplify it with a nullish operator
  // data.liked_by_users_length ?? 0
  // ?? (nullish coalescing operator) checks if data.liked_by_users_length is null or undefined—and only then uses 0.

  const [errorMessage, setErrorMessage] = useState("");

  const [dataLiked, setdataLiked] = useState(
    data.liked_by_users.includes(userId),
  );
  const [signedInUsersId, setSignedInUsersId] = useState(userId);
  const likesColor = dataLiked ? "red" : "#87ceeb";
  const currentTargetedId = data.$id;

  // const userFromAuthFunction = async () => {
  //   let userFromAuth = await getUser();
  //   setSignedInUsersId(userFromAuth ? userFromAuth.$id : "");
  // };

  useEffect(() => setSignedInUsersId(userId), [userId]);

  // useEffect(() => {
  //   console.log("use effect ran in likes button");
  //   userFromAuthFunction();
  // }, []);

  useEffect(() => {
    if (userId === "guest") {
      return;
    } else {
      if (data.liked_by_users.includes(userId)) {
        setdataLiked(true);
      } else {
        setdataLiked(false);
      }
    }
  }, [userId]);

  const handlelikes = (event: React.MouseEvent<HTMLButtonElement>) => {
    //This lead to an error (event: React.MouseEventHANDLER<HTMLButtonElement>)
    //which read as A function that takes a React.MouseEventHandler<HTMLButtonElement> as a parameter and returns void
    // ❌ This says "event is a function", which breaks typing

    //the correct type is (event: React.MouseEvent<HTMLButtonElement>)
    // which correctly reads as A function that takes a MouseEvent, not a function, and returns void.

    if (!signedInUsersId) {
      if (errorMessage === "") {
        setErrorMessage("please sign in to like");
      } else {
        setErrorMessage("");
      }
      return;
    }

    const putLikes = async () => {
      try {
        const response = await axios.put(apiLink, {
          currentTargetedId,
          signedInUsersId,
        });

        setdataLiked(!dataLiked);
        setLikesCount((prev) => (dataLiked ? prev - 1 : prev + 1));

        //  return dataLiked == true
        // ? setLikesCount((likesCount -= 1))
        // : setLikesCount((likesCount += 1))

        //  The above code was modifying likesCount using += and -= directly, which is mutating local state. This is a big no no in React
        //React's state should always be treated as immutable.

        //setLikesCount(prev => (dataLiked ? prev - 1 : prev + 1));
      } catch (err) {
        console.log("something went wrong :(", err);
      }
    };
    putLikes();
  };

  return (
    <div className="block text-center my-auto">
      <label id="likesbutton">
        <button
          onClick={handlelikes}
          id="likesbutton"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={`  ${HeartIconStyling} text-xl`}
            color={likesColor}
          />

          <span className={`${HeartIconTextStyling}`}>{likesCount}</span>
          {errorMessage && (
            <div className="bg-red-600 text-white max-w-fit mx-auto p-2">
              {" "}
              {errorMessage}
            </div>
          )}
        </button>
      </label>
    </div>
  );
}
