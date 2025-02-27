import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { getUser } from "../../partials/auth";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function LikesButtonAndLikesLogic({
  data,
  UsersId,
  apiLink,
  HeartIconStyling,
  HeartIconTextStyling,
}) {
  let [likesCount, setLikesCount] = useState(
    data.liked_by_users == [] ? 0 : data.liked_by_users.length,
  );

  const [dataLiked, setdataLiked] = useState(false);
  const [signedInUsersId, setSignedInUsersId] = useState("");
  let likesColor = dataLiked ? "red" : "#87ceeb";
  let currentTargetedId = data.$id;

  useEffect(() => {
    console.log("use effect ran");
    const userFromAuthFunction = async () => {
      let userFromAuth = await getUser();
      setSignedInUsersId(userFromAuth ? userFromAuth.$id : "");
    };
    userFromAuthFunction();
  }, []);

  //   useEffect(() => {
  //     if (signedInUsersId) {
  //       userId = signedInUsersId;
  //     }
  //     data.likedby.includes(userId) ? setdataLiked(true) : setdataLiked(false);
  //   }, [userId]);

  const handlelikes = (e) => {
    //     {
    //       !signedInUsersId &&
    //         toast.error("Please sign in to like", {
    //           position: toast.POSITION.BOTTOM_CENTER,
    //         });
    //     }

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
    <span>
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
      </label>
    </span>
  );
}
