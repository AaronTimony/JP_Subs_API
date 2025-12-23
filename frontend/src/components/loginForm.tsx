import "../css/login.css"

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
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h2 className="login-title">Login</h2>

        <div className="form-field">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="Username-Field"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="Password-Input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  )
}
