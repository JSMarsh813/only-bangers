import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { getUser } from "../../partials/auth";
import { useUser } from "../components/context-wrappers/UserInfo";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function LikesButtonAndLikesLogic({
  data,
  UsersId,
  apiLink,
  HeartIconStyling,
  HeartIconTextStyling,
}) {
  let userInfo = useUser();
  let { currentUsersInfo, other } = userInfo;
  let userId = currentUsersInfo ? currentUsersInfo.$id : "guest";

  let [likesCount, setLikesCount] = useState(
    data.liked_by_users == [] ? 0 : data.liked_by_users.length,
  );

  let [errorMessage, setErrorMessage] = useState("");

  const [dataLiked, setdataLiked] = useState(
    data.liked_by_users.includes(userId),
  );
  const [signedInUsersId, setSignedInUsersId] = useState(userId);
  let likesColor = dataLiked ? "red" : "#87ceeb";
  let currentTargetedId = data.$id;

  // const userFromAuthFunction = async () => {
  //   let userFromAuth = await getUser();
  //   setSignedInUsersId(userFromAuth ? userFromAuth.$id : "");
  // };

  useEffect(() => setSignedInUsersId(userId), [userInfo]);

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

  const handlelikes = (e) => {
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
        return dataLiked == true
          ? setLikesCount((likesCount -= 1))
          : setLikesCount((likesCount += 1));
      } catch (err) {
        console.log("something went wrong :(", err);
      }
    };
    putLikes();
  };

  return (
    <div className="block text-center my-auto">
      <label id="likesbutton">
        <input
          type="button"
          onClick={handlelikes}
          htmlFor="likesbutton"
        />

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
      </label>
    </div>
  );
}
