import React from 'react'
// 这是一个ui组件，用于过滤待办事项的展示，他不负责过滤逻辑，只是负责展示，逻辑由父组件负责
interface FilterBarProps {
  filter: "all" | "active" | "completed";
  onChange: (filter: "all" | "active" | "completed") => void;
}
const FilterBar: React.FC<FilterBarProps> = ({ filter, onChange }) => {
  return (
    <div>
      <button onClick={() => onChange("all")}>全部</button>
      <button onClick={() => onChange("active")}>未完成</button>
      <button onClick={() => onChange("completed")}>已完成</button>
    </div>
  );
};
export default FilterBar;