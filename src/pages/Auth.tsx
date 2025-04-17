
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

type LoginFormValues = {
  email: string;
  password: string;
};

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Auth = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await signIn(values.email, values.password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await signUp(values.email, values.password, values.firstName, values.lastName);
      // Do not navigate away as user needs to verify email first
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <AuthHeader title="Tuneator" subtitle="Metadata & Asset Manager" />
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <LoginForm onSubmit={onLoginSubmit} isSubmitting={isSubmitting} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                  <RainbowButton onClick={() => navigate('/dashboard')}>
                    Sign In
                  </RainbowButton>
                  <RainbowButton onClick={() => navigate('/auth?tab=register')}>
                    Sign Up
                  </RainbowButton>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RegisterForm onSubmit={onRegisterSubmit} isSubmitting={isSubmitting} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                  <RainbowButton onClick={() => navigate('/auth?tab=login')}>
                    Sign In
                  </RainbowButton>
                  <RainbowButton onClick={() => navigate('/dashboard')}>
                    Sign Up
                  </RainbowButton>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
