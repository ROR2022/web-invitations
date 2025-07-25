import { signUpAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import LegalAdvice from '../legalAdvice';
import { SocialAuthButtons } from '../social-auth-buttons';

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Registrarse</h1>
        <p className="text-sm text text-foreground">
          Ya tienes una cuenta?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Iniciar sesión
          </Link>
        </p>
        <div className="flex items-center justify-center my-3">
          <div className="w-full h-[1px] bg-border"></div>
        </div>
        <LegalAdvice />
        <div className="flex items-center justify-center my-3">
          <div className="w-full h-[1px] bg-border"></div>
        </div>
        <div className='my-4'>
        <SocialAuthButtons />
        </div>
        <div className="flex items-center justify-center my-3">
          <div className="w-full h-[1px] bg-border"></div>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="tu@correo.com" required />
          <Label htmlFor="password">Contraseña</Label>
          <Input
            type="password"
            name="password"
            placeholder="Tu contraseña"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Registrando...">
            Registrarse con correo
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
