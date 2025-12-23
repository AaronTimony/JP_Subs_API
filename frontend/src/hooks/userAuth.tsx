import {useQuery, useMutation} from "@tanstack/react-query"


export function useAuth() {
  const registerUser = useMutation({
    mutationFn: async ({user_data}: any) => {
      const response = await fetch("http://localhost:8000/auth/Register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user_data)
      })

      if (!response.ok) {
        throw new Error("Could not register user")
      }

      const data = await response.json()

      return data
    },

    onSuccess: () => { "User Registered Successfully!" }
  })

  const loginUser = useMutation({
    mutationFn: async ({formData}: any) => {
      const response = await fetch("http://localhost:8000/auth/Login", {
        method: "POST",
        credentials: "include",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Could not log user in")
      }

      const data = await response.json()

      return data
    },
    onSuccess: () => { console.log("Successful Login") }
  })

  return {registerUser, loginUser}
}

export function useCookieCheck() {
  const checkCookie = useQuery({
    queryKey: ["Cookie"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/auth/Cookie", {
        credentials: "include"
      })

      if (response.status == 401) {

        return {"authenticated" : false}
      }
      if (!response.ok) {
        throw new Error("Cookie is not available")
      }

      const data = await response.json()

      return data
    }
  })

  return {checkCookie}
}
