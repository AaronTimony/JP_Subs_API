import {useState} from "react"
import {RegisterForm} from "../components/register";
import {useAuth} from "../hooks/userAuth"

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const {registerUser} = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email : '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    registerUser.mutate({user_data: formData})
    console.log(formData)
  }

  return (
    <div className="RegisterForm">
      <RegisterForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit}/>
    </div>
  )

}
