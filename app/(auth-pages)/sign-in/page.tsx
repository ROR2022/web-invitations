import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LegalAdvice from "../legalAdvice";
import { SocialAuthButtons } from '../social-auth-buttons';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Iniciar sesión</h1>
      <p className="text-sm text-foreground">
        No tienes una cuenta?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Registrarse
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
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Tu contraseña"
          required
        />
        <SubmitButton pendingText="Iniciando sesión..." formAction={signInAction}>
          Iniciar sesión con correo
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
