import React from 'react'
// 这是一个ui组件，用于过滤待办事项的展示，他不负责过滤逻辑，只是负责展示，逻辑由父组件负责
interface FilterBarProps {
  filter: "all" | "active" | "completed";
  onChange: (filter: "all" | "active" | "completed") => void;
}
const FilterBar: React.FC<FilterBarProps> = ({ filter, onChange }) => {
    //利用filter控制按钮的选中状态
    const tabClass = (key: string) =>
        `px-4 py-2 text-sm font-medium transition
   ${filter === key
            ? "text-blue-600 font-semibold border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        }`;

  return (
    // 外层容器，flex布局，居中对齐，间距6px，下外边距6px
    <div className='flex justify-center gap-6 mb-6'>
      <button className={tabClass("all")} onClick={() => onChange("all")}>全部</button>
      <button className={tabClass("active")} onClick={() => onChange("active")}>未完成</button>
      <button className={tabClass("completed")} onClick={() => onChange("completed")}>已完成</button>
    </div>
  );
};
export default FilterBar;