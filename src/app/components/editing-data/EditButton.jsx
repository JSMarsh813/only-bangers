import React, { useState } from "react";
import GeneralButton from "../GeneralButton";
import EditPostForm from "../form/EditPostForm";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export default function EditButton({ post, tagList }) {
  const [editFormVisible, setEditFormVisible] = useState(false);
  return (
    <>
      <GeneralButton
        text="Edit"
        className="mx-auto bg-blue-900"
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
        />
      )}
    </>
  );
}
