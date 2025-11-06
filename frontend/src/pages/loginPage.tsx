import {useState} from "react"
import { LoginForm } from "../components/loginForm";
import {useAuth} from "../hooks/userAuth"

interface LoginForm {
  username: string
  password: string
}

export function LoginPage() {
  const {loginUser} = useAuth();

  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    loginUser.mutate(formData)
  }

  return (
  <LoginForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
  )
}
