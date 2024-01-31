import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from "react-icons/ti";

export default function SortToggle(props: {
  sort: "asc" | "desc" | false;
  onClick?: () => void;
  className?: string;
}) {
  const { sort, onClick, className } = props;
  return (
    <span className={className} onClick={onClick}>
      {sort ? (
        sort === "desc" ? (
          <TiArrowSortedDown className="inline-block" />
        ) : (
          <TiArrowSortedUp className="inline-block" />
        )
      ) : (
        <TiArrowUnsorted className="inline-block" />
      )}
    </span>
  );
}
