import Logo from '../components/ui/Logo';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mb-8" />
          <h1 className="text-2xl font-bold text-[#333333] mb-2 font-['Montserrat']">
            Bem-vindo à Alicit
          </h1>
          <p className="text-gray-600 text-sm font-['Montserrat']">
            Faça login para acessar sua plataforma
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}