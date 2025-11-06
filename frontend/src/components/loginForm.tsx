interface LoginForm {
  username: string
  password: string
}

interface LoginFormProps {
  formData: LoginForm
  setFormData: React.Dispatch<React.SetStateAction<LoginForm>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({formData, setFormData, onSubmit}: LoginFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name] : value,
    }));
  }

  return (
  <div className="Login-form">
      <form onSubmit={onSubmit} className="submit-form">
        <label htmlFor="username">Username:</label>
        <input
        type="text"
        name="username"
        id="Username-Field"
        value={formData.username}
        onChange={handleChange}
        />
      <label htmlFor="password">Password:</label>
      <input
      id="Password-Input"
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      />
      <button type="submit">Login</button>
      </form>
  </div>
  )
}
