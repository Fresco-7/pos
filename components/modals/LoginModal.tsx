'use client';
import { useCallback, useMemo, useState } from "react";
import { signIn } from "@/auth";
import useRegisterModal from "@/components/hooks/useRegisterModal";
import useLoginModal from "@/components/hooks/useLoginModal";
import Modal from "./Modal";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import Heading from "@/components/Heading";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/actions/users/forgot-password/forgotPassword";
import { Button } from "../ui/button";
import { AuthError } from "next-auth";
import { login } from "@/actions/users/login";


enum SHOW {
  LOGIN = 0,
  FORGOT_PASSWORD = 1,
}

const LoginModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(SHOW.LOGIN)

  const onBack = () => {
    setShow((value) => value - 1);
  }
  const onNext = () => {
    setShow((value) => value + 1);
  }

  const handleClose = () => {
    setEmail('');
    setPassword('');
    loginModal.onClose();
    setShow(0);
  }

  const secondaryActionLabel = useMemo(() => {
    if (show === SHOW.LOGIN) {
      return undefined;
    }
    return 'Back';
  }, [show])

  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setIsDisabled] = useState(false);


  const handleSubmit = async () => {

    setIsDisabled(true);
    setIsLoading(true);
    const message = await forgotPassword(email);
    if (typeof message != 'string') {
      toast.error(message.error);
    } else {
      toast.success('Reset password email sent');
      setShow(0);
    }
    setIsLoading(false);
    setIsDisabled(false);
  }

  const onSubmit = async () => {
    setIsLoading(true);
    setIsDisabled(true);

    const message = await login({ email, password });
    if (message?.error) {
      toast.error(message.error);
    } else {
      toast.success('Logged in');
      handleClose();
      router.refresh();
    }
    setIsLoading(false);
    setIsDisabled(false);
  }
  const onToggle = useCallback(() => {
    handleClose()
    registerModal.onOpen();
  }, [loginModal, registerModal])


  let title = "Login"
  let actionLabel = undefined

  let bodyContent = (

    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome again"
        subtitle="Log in to your account!"
      />
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type='email' id="email" placeholder="Email" value={email} onChange={(ev: any) => { setEmail(ev.target.value); }} />
        </div>
        <div className="relative">
          <Label htmlFor="email">Password</Label>
          <Input
            id="password"
            type="password"
            onChange={(ev) => { setPassword(ev.target.value); }}
            value={password}
            placeholder="Password"
            password
          />
        </div>
        <div className="">
          <Button disabled={isLoading} isLoading={isLoading} className="w-full" onClick={onSubmit} >Login</Button>
        </div>
      </div>
    </div>
  )
  const footerContent = (
    <>
      <div className="flex flex-col gap-4 items-center cursor-default">
        <div className="text-neutral-800 dark:text-white font-light text-muted-foreground hover:underline hover:cursor-pointer hover:text-primary " >
          <p onClick={() => { onNext() }}> Forgot your password?</p>
        </div>
      </div>
      <div className="flex flex-col items-center text-muted-foreground text-center font-light">
        <span className="">{`Don't have an account?`}
          <span
            onClick={onToggle}
            className="
              ml-1
            text-neutral-800
            dark:text-white
              text-muted-foreground 
              hover:text-primary
              hover:cursor-pointer
              hover:underline
            "
          >Create an account</span>
        </span>
      </div>
    </>
  )

  if (show === SHOW.FORGOT_PASSWORD) {
    title = "Forgot your passoword?"
    actionLabel = "Send Email"
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Forgot your Password?" />
        <div className="grid w-full items-center gap-4 mb-3">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type='email' id="email" placeholder="Email" value={email} onChange={(ev: any) => { setEmail(ev.target.value); }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isLoading={isLoading}
      disabled={disabled}
      isOpen={loginModal.isOpen}
      title={title}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={onBack}
      onClose={handleClose}
      onSubmit={show === SHOW.FORGOT_PASSWORD ? handleSubmit : () => null}
      body={bodyContent}
      footer={show === SHOW.FORGOT_PASSWORD ? undefined : footerContent}
    />
  );
}

export default LoginModal;