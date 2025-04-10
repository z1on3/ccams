// app/login/page.tsx
import FarmerLoginForm from '@/components/Auth/FarmerLoginForm';
import Image from 'next/image';

export default function FarmerLogin() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Image
              width={100}
              height={100}
              src="/images/logo/logo-circle.png"
              alt="Logo"
              priority
              className="dark:hidden"
            />
            <Image
              width={100}
              height={100}
              src="/images/logo/logo-circle.png"
              alt="Logo"
              priority
              className="hidden dark:block"
            />
          </div>
          <div className="mb-8 text-center">
            <h4 className="mb-1.5 text-2xl font-bold text-black dark:text-white">
              Farmer Login
            </h4>
            <p className="text-body-color">
              Sign in using your Farmer Username and Birthday
            </p>
          </div>
          <FarmerLoginForm />
        </div>
      </div>
      <div className="hidden flex-1 items-center justify-center bg-primary lg:flex">
        <Image
          width={500}
          height={500}
          src="/images/logo/logo-circle.png"
          alt="Logo"
          priority
          className="max-w-full"
        />
      </div>
    </div>
  );
}
