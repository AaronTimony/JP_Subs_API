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
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={onSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center text-white mb-4">Login</h2>

        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="Username-Field"
            value={formData.username}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="Password-Input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  )
}
