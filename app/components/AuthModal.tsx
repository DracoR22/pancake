import useAuthModal from "../hooks/useAuthModal"
import Modal from "./Modal"
import UserAuthForm from "./UserAuthForm"



const SignInModal = () => {

const {onClose, isOpen} = useAuthModal()


const onChange = (open: boolean) => {
    if (!open) {
        onClose()
    }
  }

  return (
    <div className="">
    <Modal title="Welcome back" description="Login to your google account to continue" isOpen={isOpen}
    onChange={onChange}>
       <UserAuthForm/>
    </Modal>
    </div>
  )
}

export default SignInModal