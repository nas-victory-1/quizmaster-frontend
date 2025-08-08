import type { ReactNode } from "react";

type buttonProps = {
    label:string,
    mode?: "filled" | "notFilled" | "custom",
    children?:ReactNode,
    className?: string

}

const Button = ({
    label,
    mode= 'filled',
    children,
    className
}:buttonProps) => {

    const normalStyles:string = 'px-5 py-2 font-semibold rounded hover:cursor-pointer';


    const modes = {
        filled: 'bg-[#9333EA] text-white',
        notFilled: 'bg-white text-[#9333EA]',
        custom: ''
    }
    return ( 
        <button className ={`${normalStyles} ${modes[mode]} ${className}`}>
            {label}{children}
        </button>
     );
}
 
export default Button;