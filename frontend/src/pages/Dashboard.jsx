import { testApi } from "../service/authService";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../service/userService";
import { Navigate } from "react-router-dom";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  
useEffect(() => {

    const loadProfile = async () => {

        try {

            const data = await getCurrentUser();

            setUser(data);

        } catch (error) {

            console.log(error);

        }

    };

    loadProfile();

}, []);
const handleLogout = async (e) => {
  e.preventDefault();
    console.log("Inside HandleLogout")
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href="/"
}
  return (
    <div>
      <h1 className="text-3xl font-bold">

    Welcome back,

    {user?.name} 👋

</h1>
<p>

    Role : {user?.role}

</p>
<button
onClick={handleLogout}
className="flex items-center bg-red-600 gap-2 px-4 py-2 tex-sm font-bold text-white rounded-lg hover:bg-red-400 hover:text-gray-900 transition-colors duration-200  ">
  LogOut
</button>
    </div>
  
  );
}
