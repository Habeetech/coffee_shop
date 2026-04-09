import "./Spinner.css"

export default function Spinner ({size = "5rem"}) {
    return (<div 
        className="spinner"
        style={{ "--size": size }}
    ></div>)
}