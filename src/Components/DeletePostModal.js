import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../Features/postSlice";
import { setDeleteModalOpen } from "../Features/postSlice";

export default function DeletePostModal({getSelectedUser}) {

    const {deleteModal} = useSelector((store) => store.post)
    const dispatch = useDispatch()

    const customStyles = {
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
        },
    };

    async function handleDelete() {
        await dispatch(deletePost())
        getSelectedUser()
    }

    return (
        <Modal
            isOpen={deleteModal.open}
            style={customStyles}
        >
            <div>
                <div className="card">
                    <div className='card-title p-3'>
                        Delete listing ?
                    </div>
                    <div className='card-footer d-flex justify-content-between align-items-center'>
                        <button className='btn btn-danger ms-2' onClick={() => handleDelete()}>Confirm</button>
                        <button className='btn btn-success ms-2' onClick={() => dispatch(setDeleteModalOpen(false))}>Cancel</button>
                    </div>
                </div>
            </div>    
        </Modal>
    )
}