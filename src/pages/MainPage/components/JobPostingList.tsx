import JobPostingCard from "./JobPostingCard";

const JobPostingList = () => {
  const lists = new Array(12).fill(1);

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-[30px] md:grid-cols-2 lg:grid-cols-3">
      {lists.map((_, index) => (
        <JobPostingCard key={index} />
      ))}
    </ul>
  );
};

export default JobPostingList;
