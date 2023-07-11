import { useDispatch, useSelector } from "react-redux";
import { setFilter, clearFilters } from "../Features/postSlice";

export default function FilterDropdown() {

    const dispatch = useDispatch()
    const filter = useSelector((store) => store.post.filter)
    let activeFilterNr = 0;
    for (let prop in filter) {
        if (filter[prop] !== "") {
            ++activeFilterNr
        }
    }

    return (
        <div className="dropdown">
            <div className="nav-item dropdown-toggle mt-3" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">Filter({activeFilterNr})</div>
            <form className="dropdown-menu p-2 filter-dropdown">
                <label htmlFor="make">Make</label>
                <input type="text" className="form-control" id="make" value={filter.make} onChange={(e) => dispatch(setFilter({name: 'make', value : e.target.value}))}/>
                <label htmlFor="modelYear">First Registration</label>
                <div className="d-flex flex-row" id="modelYear">
                    <input type="text" className="form-control me-1" placeholder="from" value={filter.registration_from} onChange={(e) => dispatch(setFilter({name : 'registration_from', value: e.target.value}))}/>
                    <input type="text" className="form-control ms-1" placeholder="until" value={filter.registration_until} onChange={(e) => dispatch(setFilter({name : 'registration_until', value: e.target.value}))}/>
                </div>
                <label htmlFor="price">Price</label>
                <div className="d-flex flex-row" id="price">
                    <input type="text" className="form-control me-1" placeholder="from" value={filter.price_from} onChange={(e) => dispatch(setFilter({name: 'price_from', value: e.target.value}))}/>
                    <input type="text" className="form-control ms-1" placeholder="until" value={filter.price_until} onChange={(e) => dispatch(setFilter({name: 'price_until', value: e.target.value}))}/>
                </div>
                <label htmlFor="mileage">Mileage(km)</label>
                <div className="d-flex flex-row" id="mileage">
                    <input type="text" className="form-control me-1" placeholder="from" value={filter.mileage_from} onChange={(e) => dispatch(setFilter({name: 'mileage_from', value: e.target.value}))}/>
                    <input type="text" className="form-control ms-1" placeholder="until" value={filter.mileage_until} onChange={(e) => dispatch(setFilter({name: 'mileage_until', value: e.target.value}))}/>
                </div>
            <button className="btn btn-outline-danger mt-2" onClick={(e) => {e.preventDefault(); dispatch(clearFilters())}}>Clear filters</button>
            </form>
        </div>
    )
}