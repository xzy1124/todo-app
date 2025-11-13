// 集中定义待办事项todo的属性，有标题和是否已完成的选项，还有唯一id
export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    deadline?: string;
    priority?: 'high' | 'medium' | 'low';
    group?: string;
}