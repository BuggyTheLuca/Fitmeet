import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
import { Register } from "../pages/auth/Register";
import { Login } from "../pages/auth/Login";
import '../index.css'
import { Home } from "@/pages/Home";
import { InitLayout } from "@/components/common/InitLayout";
import {  ProtectedLayout } from "./ProtectedLayout";
import { Layout } from "@/components/common/Layout";
import { ActivitiesByType } from "@/pages/activity/ActivitiesByTypes";
import { RefreshProvider } from "@/contexts/activityContext";
import { Profile } from "@/pages/profile/Profile";
import { EditProfile } from "@/pages/profile/EditProfile";

export function AppRoutes() {

  return (
    <AuthProvider>
      <RefreshProvider>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route element={<InitLayout/>}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedLayout />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/type/:typeId" element={<ActivitiesByType />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                {/* outras rotas protegidas */}
              </Route>
            </Route>

            {/* <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/event/create" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} /> */}

      {/* Rota para 404 
        <Route path="*" element={<NotFound />} />
      */}
      
        </Routes>
      </RefreshProvider>
    </AuthProvider>
  );
}