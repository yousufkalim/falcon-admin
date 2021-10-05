import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export default function index(props) {
  return (
    <ReactQuill
      value={props.value}
      onChange={props.onChange}
      modules={{
        toolbar: [
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
      }}
      formats={[
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
      ]}
      placeholder={props.placeholder}
    />
  );
}
