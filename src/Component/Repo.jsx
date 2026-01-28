import React from "react";
import RepoCard from "./RepoCard";

const Repo = ({ data }) => {
  return (
    <div className="repo-wrapper">
      {data.map((ele, idx) => {
        return (
          <RepoCard
            name={ele.name}
            url={ele.html_url}
            desc={ele.description}
            language={ele.language}
            key={idx}
          />
        );
      })}
    </div>
  );
};

export default Repo;
