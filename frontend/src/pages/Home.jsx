import { useState } from "react";
import { Eye, EyeOff, Hammer, Search, ArrowRight, Check } from "lucide-react";
import { authenticateUser } from "../service/authService";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
export default function Home() {
      return (
    <>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
    </>
  );
}
