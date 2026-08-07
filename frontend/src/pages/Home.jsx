import { useState } from "react";
import {
  Eye,
  EyeOff,
  Hammer,
  Search,
  ArrowRight,
  Check,
  Anchor,
} from "lucide-react";
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
      <h1>Home page</h1>
      <Link
        to="/signup"
        className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
      >
        Sign up
      </Link>
      <br></br>
      <Link
        to="/dashboard"
        className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
      >
        Dashboard
      </Link>
      <br></br>
      <Link
        to="/login"
        className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
      >
        Login
      </Link>
      <br></br>
      <Link
        to="/forgot-password"
        className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
      >
        Forgot Password
      </Link>
    </>
  );
}
