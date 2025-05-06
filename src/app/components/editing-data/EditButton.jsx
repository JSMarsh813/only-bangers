import React, { useState } from "react";
import GeneralButton from "../GeneralButton";
import EditPostForm from "../form/EditPostForm";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export default function EditButton({
  post,
  tagList,
  setMessageFromApi,
  setNameEditedFunction,
  postsSwrPageProperty,
  setChangedItemsSwrPageFunction,
  changedItemsSwrPage,
}) {
  const [editFormVisible, setEditFormVisible] = useState(false);
  return (
    <>
      <GeneralButton
        text="Edit"
        className=" bg-blue-950"
        type="submit"
        fontAwesome={faPencil}
        onClick={() => setEditFormVisible(!editFormVisible)}
      />
      {editFormVisible && (
        <EditPostForm
          post={post}
          tagList={tagList}
          setEditFormVisible={setEditFormVisible}
          editFormVisible={editFormVisible}
          setMessageFromApi={setMessageFromApi}
          setNameEditedFunction={setNameEditedFunction}
          postsSwrPageProperty={postsSwrPageProperty}
          setChangedItemsSwrPageFunction={setChangedItemsSwrPageFunction}
          changedItemsSwrPage={changedItemsSwrPage}
        />
      )}
    </>
  );
}
