import { useState } from "react"

export default function useLogin() {
    const [username, setUsername] = useState('')
    const [usertype, setUsertype] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return {
        username,
        setUsername,
        usertype,
        setUsertype,
        phone,
        setPhone,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
    }
}