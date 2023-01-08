import React from "react";
import { Badge } from "react-bootstrap";

export const Tags = ({ tags }) => {
  let tagArray = (tags.split(","));
  // console.log(tagArray);

  function removeDuplicates(arr) {
    return arr.filter((item, 
        index) => arr.indexOf(item) === index);
}

  let newtagArray = removeDuplicates(tagArray);
  return (
    <div>
      {newtagArray.map((item, index) => {
        return <Badge key={index} className="bg-info">{item}</Badge>
      })}
    </div>
  );
};
