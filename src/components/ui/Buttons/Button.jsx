const Button = ({children,className="",type="default",size="md",icon="",disabled=false,onClick={}}) => {
    
    const getButtonClasses = () => {
        const classList = ["button",className] ;
        classList.push(`button--${type}`);
        classList.push(`button--${size}`);
        return classList.join(" ")
    }
    
    return ( 
        <button className={getButtonClasses()} onClick={onClick} disabled={disabled}>{children}</button> 
    );
}
 
export default Button;