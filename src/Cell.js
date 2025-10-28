import React from "react";

const Cell = ({ type }) => {
  let className = "cell";
  let content = "";

  if (type === "T") {
    className += " cell-T";
    content = "🏁";
  } else if (type === "W") {
    className += " cell-W";
  } else if (type === "H") {
    className += " cell-H";
  } else if (type.startsWith("O")) {
    className += " cell-O";
  } else {
    className += " cell-E";
  }

  return <div className={className}>{content}</div>;
};

export default React.memo(Cell);
