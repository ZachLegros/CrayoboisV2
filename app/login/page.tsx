import LoginForm from "./login-form";

export default async function LoginPage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px-1.5rem)] md:h-[calc(100vh-64px-3rem)]">
      <LoginForm />
    </div>
  );
}
