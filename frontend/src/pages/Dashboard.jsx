import { testApi } from "../service/authService";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../service/userService";
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
  return (
    <div>
      <h1 className="text-3xl font-bold">

    Welcome back,

    {user?.name} 👋

</h1>
<p>

    Role : {user?.role}

</p>
    </div>
  );
}
