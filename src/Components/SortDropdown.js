import { useDispatch } from "react-redux"
import { setOrderby } from "../Features/browseSlice"

export default function SortDropdown() {

    const dispatch = useDispatch()

    return (
        <div className="dropdown">
            <div className="nav-item dropdown-toggle mt-3" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">Order by</div>
            <ul className="dropdown-menu dropdown-menu-end p-2">
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('-added'))}>Date Added <i className="bi bi-arrow-down"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('added'))}>Date Added <i className="bi bi-arrow-up"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('-price'))}>Price <i className="bi bi-arrow-down"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('price'))}>Price <i className="bi bi-arrow-up"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('-modelYear'))}>First Registration <i className="bi bi-arrow-down"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('modelYear'))}>First Registration <i className="bi bi-arrow-up"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('-mileage'))}>Mileage(km) <i className="bi bi-arrow-down"></i></li>
                <li className="dropdown-item" style={{cursor: "pointer"}} onClick={(e) => dispatch(setOrderby('mileage'))}>Mileage(km) <i className="bi bi-arrow-up"></i></li>
            </ul>
        </div>
    )
}