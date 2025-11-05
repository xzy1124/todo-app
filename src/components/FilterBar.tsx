import React from 'react'
// 这是一个ui组件，用于过滤待办事项的展示，他不负责过滤逻辑，只是负责展示，逻辑由父组件负责
interface FilterBarProps {
  filter: "all" | "active" | "completed";
  onChange: (filter: "all" | "active" | "completed") => void;
}
const FilterBar: React.FC<FilterBarProps> = ({ filter, onChange }) => {
    //利用filter控制按钮的选中状态
    const activeStyle = {
        fontweight: 'bold',
        color: 'blue',
    }
  return (
    <div>
      <button style={filter === "all" ? activeStyle : {}} onClick={() => onChange("all")}>全部</button>
      <button style={filter === "active" ? activeStyle : {}} onClick={() => onChange("active")}>未完成</button>
      <button style={filter === "completed" ? activeStyle : {}} onClick={() => onChange("completed")}>已完成</button>
    </div>
  );
};
export default FilterBar;