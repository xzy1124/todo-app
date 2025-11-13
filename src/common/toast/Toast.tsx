import styles from './Toast.module.css';
import { useState, useEffect } from 'react';
type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose?: () => void;
    position?: 'top' | 'bottom' | 'left' | 'right';
}
const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 2000,
    onClose,
    position = 'top-right',
}) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
            //如果父组件传递onClose函数了，我们就调用它，也就是通知父组件删除这个toast，这其实就是回调函数
            if(onClose) onClose()
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])
    if(!visible) return null
    return (
        <div className={`${styles.toast} ${styles[type]} ${styles[position]}`}>
            {message}
        </div>
    );
};
export default Toast;
