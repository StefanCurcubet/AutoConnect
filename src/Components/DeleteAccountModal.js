import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { deleteUser, setDeleteModal } from "../Features/userSlice"

export default function DeleteAccountModal() {

    const {deleteModalOpen} = useSelector((store) => store.user)
    const dispatch = useDispatch()

    const customStyles = {
        content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            border: 'none',
        }
    }

    return (
        <Modal
            isOpen={deleteModalOpen}
            style={customStyles}
        >
            <div>
                <div className="card">
                    <div className='card-title p-3'>
                        Are you sure you want to delete your account ?
                    </div>
                    <div className='card-footer d-flex justify-content-center'>
                        <button className='btn btn-danger' onClick={() => dispatch(deleteUser())}>Confirm</button>
                        <button className='btn btn-success ms-2' onClick={() => dispatch(setDeleteModal(false))}>Cancel</button>
                    </div>
                </div>
            </div> 
        </Modal>
    )
}